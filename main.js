const path = require('path');

const arduino = require('./serial.js');

const express = require('express');
const nodeSassMiddleware = require('node-sass-middleware');
const app = express();

app.use(nodeSassMiddleware({
  src: path.join(__dirname, 'sass'),
  dest: path.join(__dirname, 'public'),
  outputStyle: 'compressed'
}));

app.use(express.static('public'));
app.use(express.static('node_modules'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

const httpServer = require('http').createServer(app);
let io = require('socket.io')(httpServer);

let interval;

io.on('connect', socket => {
  console.log('socket.io connection established');

  interval = setInterval(() => {
    socket.emit('data-sample', arduino.getDataSample());
  }, 1000)
})

httpServer.listen(3000, () => {
  console.log('Server listening on port 3000');
})
