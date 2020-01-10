/*
* Socket interface
*/

// tslint:disable: import-name
import socketIO from 'socket.io';
import http from 'http';
import { socketSessionIdParser } from './utils';

export type SocketParams = {
  server: http.Server,
  path?: string,
};

export default class Socket {

  private io: socketIO.Server | null = null;
  // CLIENT LOOKUP
  // sessionId to client
  private clients: Record<string, socketIO.Socket> = {};
  // client to sessinId
  private sessions: Map<socketIO.Socket, string> = new Map();

  // SUBSCRIPTIONS LOOKUP - uses set instead of arrays for constant time add/delete operations
  // event to sockets
  private events: Record<string, Set<socketIO.Socket>> = {};
  // socket to events
  private subscriptions: Map<socketIO.Socket, Set<string>> = new Map();

  private static instances: Socket[] = [];
  private static instanceEqualityChecks: (keyof SocketParams)[] = ['server', 'path'];

  constructor(private params: SocketParams) {
    const existingInstance = Socket.findInstance(params);
    if (existingInstance) return existingInstance;

    this.io = params.path
      ? socketIO(params.server, { path: params.path })
      : socketIO(params.server);

    // register middleware to attach sessionId to client objects
    this.io.use(socketSessionIdParser);

    // init
    this.io.on('connection', (client) => {
      this.registerSocket(client);
      client.on('disconnect', () => this.unregisterSocket(client));
    });

    Socket.registerInstance(this);
  }

  private static findInstance(params: SocketParams): Socket | undefined {
    return this.instances.find(
      (instance: Socket): boolean => {
        return this.instanceEqualityChecks.every((param): boolean => instance.params[param] === params[param]);
      });
  }

  private static registerInstance(instance: Socket): void {
    this.instances.push(instance);
  }

  private registerSocket(client: socketIO.Socket) {
    // add client to lookup maps
    const sessionId = client.sessionId!;
    this.clients[sessionId] = client;
    this.sessions.set(client, sessionId);
  }

  private unregisterSocket(client: socketIO.Socket) {
    const sessionId = client.sessionId!;

    // unsubscribe from all
    this.unsubscribe(sessionId);

    // remove client from lookup maps
    delete this.clients[sessionId];
    this.sessions.delete(client);

  }

  public subscribe(sessionId: string, event: string): void {

    console.log('subscribing to', event, sessionId);
    
    const client = this.clients[sessionId];
    if (!client) throw Error('Socket client is not registered');

    // add client to event
    this.events[event] = this.events[event] || new Set();
    this.events[event].add(client);

    // add event to client's subscriptions
    const subscriptions = this.subscriptions.get(client) || new Set();
    this.subscriptions.set(client, subscriptions.add(event));
    console.log(this);

  }

  // unsubscribe from all if event is not supplied
  public unsubscribe(sessionId: string, event?: string): void {

    const client = this.clients[sessionId];

    // client should always exit when functin called from unregisterSocket
    if (!client) throw Error('Socket client is not registered');
    const subscriptions = this.subscriptions.get(client);
    // exit if no subscriptions
    if (!subscriptions) return;

    // unsubscribe from individual event
    if (event) {
      // remove from event
      this.events[event] = this.events[event] || new Set();
      this.events[event].delete(client);

      // remove from subscriptions
      subscriptions.delete(event);

      return;
    }

    // unsubscribe client from all subscriptions
    for (const subscription of subscriptions) {
      this.unsubscribe(sessionId, subscription);
    }

    // delete client key in subscriptions
    this.subscriptions.delete(client);

  }

  broadcast(event: string, data: string) {
    this.emit(event, data);
  }

  emit(event: string, data: string, sessionId?: string) {
    // get subscribers for event
    const clients = this.events[event];

    // exit if event was never initialized i.e. has no subscribers
    if (!clients) return;

    // single client
    if (sessionId) {
      const client = this.clients[sessionId];
      client && client.emit(event, data);
    }

    // broadcast
    for (const client of clients) {
      client.emit(event, data);
    }
  }

}