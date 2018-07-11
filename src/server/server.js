const http = require('http');
const socketio = require('socket.io');
const GDAX = require('gdax');
const env = {}

const port = env.PORT || 4001;
const server = http.createServer((request, response) => {
  response.statusCode = 200;
  response.setHeader('Content-Type', 'text/plain');
  response.end('API Documentation');
});
const socket = socketio(server);
const coinbaseClient = new GDAX.PublicClient();

socket.on('connection', client => {
  setInterval( () => getPrices(client), 2000);
  client.on('disconnect', handleDisconnect);
  client.on('error', handleError); //TODO Write to log file
});

server.listen(port, function(err) {
  if(err)
    throw err;
  console.log('Listen');
});

const getPrices = async socket => {
  coinbaseClient.getProducts()
    .then(data => {
      socket.emit('getPrice', data);
    })
    .catch(error => {
      return console.dir(error);
    });
}
