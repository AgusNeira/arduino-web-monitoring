let arduino = require('./serial.js');

const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})

const httpServer = require('http').createServer(app);
let io = require('socket.io')(httpServer);

let interval;

io.on('connect', socket => {
  socket.emit('message', 'connection established');
  console.log('socket.io connection established');

  interval = setInterval(() => {
    socket.emit('message', arduino.getDataSample());
  }, 1000)
})

httpServer.listen(3000, () => {
  console.log('Server listening on port 3000');
})
