# Introducing weQuest
## A mobile app that matches user and owners of products through a reverse auction mechanism.Built for the Lighthouse Labs final project.
## Authors: [Kevin Laburte](https://github.com/kevlabs), [Leo Lee]https://github.com/leoltl), [Jackson To](https://github.com/checksonhk)

## Link: [Heroku host](https://wequest.xyz)

### Features
- Single Page Application using React and Ionic
- Users can request items for short-term rental
- Users who own the requested products are able to bid on the aforementioned requests through a reverse auction mechanism
- As no two bids are the same, the requester is presented with all bids and selected a winner
- Live updates using socket.io
- Users can see their history in the activity feed

### Getting Started

1. Fork this repository, then clone your fork of this repository.
2. Install dependencies using the npm install command.
3. Start the web server using the npm run local command. The app will be served at http://localhost:8080/.
4. Go to http://localhost:8080/ in your browser.

### Dependencies
- Express
- Node 5.10.x or above
- axios
- bcrypt
- body-parser
- chalk
- cookie-session
- dotenv
- morgan
- nexmo
- node-sass-middleware
- pg
- pg-native
- socket.io
