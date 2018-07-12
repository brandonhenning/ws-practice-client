const http = require('http');
const socketio = require('socket.io');
const CoinMarketCap = require('coinmarketcap-api');
const binanceAPI = require('binance');

//TODO Move into config
const env = {}

//TODO Create a fixtures file
const CoinFixture = {
  'BTCUSDT': {
    'name': 'Bitcoin',
    'symbol': 'BTC',
    'logo': ''

  },
  'ETHUSDT': {
    'name': 'Ethereum',
    'symbol': 'ETH',
    'logo': ''
  },
  'LTCUSDT': {
    'name': 'Litecoin',
    'symbol': 'LTC',
    'logo': ''
  }
}

const port = env.PORT || 5000;

//TODO Abstract into config
const cors_whitelist = ['http://localhost:3000', 'http://localhost:5000']

const server = http.createServer((request, response) => {
  response.statusCode = 200;
  response.setHeader('Content-Type', 'text/plain');
  let origin = request.headers.origin;
  if (cors_whitelist.indexOf(origin) > -1)
    response.setHeader('Access-Control-Allow-Origin', origin);
  response.end('API Documentation');
});

const socket = socketio(server, {origins: cors_whitelist});

const getPrices = client => {

  //TODO UNSAFE! Abstract keys into environment variables
  const binanceRest = new binanceAPI.BinanceRest({
    key: 'SXHgSDsxxLQWIhb9qjTLTbTzigufGlrds6nknEdgfSF9il8z7z3lbS1Ug7resXtt',
    secret: 'hYUl6kszdS2wvWZxE325nitMx78dzkEvoo0lySapVmfwQWSdJNKJCF24YI434BWQ'
  });

  const getBTC = binanceRest.tickerPrice('BTCUSDT');
  const getETH = binanceRest.tickerPrice('ETHUSDT');
  const getLTC = binanceRest.tickerPrice('LTCUSDT');

  Promise.all([getBTC, getETH, getLTC]).then( coins => {
    data = []
    for (index in coins) {
      let pairing = coins[index]['symbol'];
      let coin = {
        'name': CoinFixture[pairing]['name'],
        'symbol': CoinFixture[pairing]['symbol'],
        'price': `$${parseFloat(coins[index]['price']).toFixed(2)}`,
        'logo': CoinFixture[pairing]['logo']
      }
      data.push(coin);
    }
    socket.emit("getPrices", data);
  });
}

  socket.on('connection', client => {
  console.log('New client connected'),
  setInterval( () => getPrices(client), 8000);
});

server.listen(port, function(err) {
  if(err)
    throw err;
  console.log('Listening on port 5000');
});
