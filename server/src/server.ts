// tslint:disable: import-name
import path from 'path';
import express, { Router } from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';

// load .env data into process.env
import { config } from 'dotenv';
config();

import { dbParams, storageParams } from './lib/config-vars';

// instantiate db
import DB from './lib/db';
const db = new DB(dbParams);

// instantiate storage - move to router after tests
import Storage from './lib/storage';
// const storage = new Storage(storageParams);

// server config
const PORT = process.env.PORT || 5003;
const ENV = process.env.ENV || 'development';

// instantiate express
const app = express();

// register middlewares
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

// import bids for test
import Bid from './models/bid';
// const bids = new Bid();

app.get('/api/bids', async (req, res) => {
  const bids = new Bid();
  const results = await bids.findByRequest(1).run(db.query);
  res.json({ message: results });
});

// app.get('/api/upload', (req, res) => res.json({ message: 'hello' }));

// app.post('/api/upload', async (req, res) => {
//   try {
//     const data = await storage.upload64(req.body.image, `test${Date.now()}`);
//     res.json(data);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// app.post('/api/upload/delete', async (req, res) => {
//   try {
//     const data = await storage.delete(req.body.image);
//     res.json(data);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

app.use(express.static(path.join(__dirname, 'public')));

// tslint:disable-next-line
app.listen(PORT, () => console.log(`weQuest app listening on port ${PORT}`));
