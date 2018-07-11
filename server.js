const http = require('http');
const socketio = require('socket.io');

const server = http.createServer((request, response) => {
  response.statusCode = 200;
  response.setHeader('Content-Type', 'text/plain');
  response.end('API Documentation');
});
const socket = socketio(server);

socket.on('connection', function(client) {
  client.on('connect', bootstrapAPI);
  client.on('disconnect', handleDisconnect);
  client.on('error', handleError); //TODO Write to log file
});

server.listen(3000, function(err) {
  if(err) throw err;
  console.log('Listening on port 3000');
})
