const path = require('path');

const SerialPort = require('serialport');
const ReadLine = require('@serialport/parser-readline');
const port = new SerialPort('COM3', { baudRate: 9600 }, err => {
	if (err)
		console.log('Couldn\'t connect to serialport COM3: ', err.message);
	else console.log('Successfully connected to COM3');
});
const parser = port.pipe(new ReadLine());

const express = require('express');
const nodeSassMiddleware = require('node-sass-middleware');
const app = express();

// SASS configuration
app.use(nodeSassMiddleware({
	src: path.join(__dirname, 'sass'),
	dest: path.join(__dirname, 'public'),
	outputStyle: 'compressed'
}));

// Static file serving
app.use(express.static('public'));
app.use(express.static('node_modules'));

// Main route
app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
})

const httpServer = require('http').createServer(app);
let io = require('socket.io')(httpServer);

httpServer.listen(3000, () => console.log('Server listening on port 3000'));
io.on('connect', socket => {
	console.log('socket.io connection established');

	parser.on('data', data => {
		console.log(data);
		socket.emit('data-sample', data);
	});
});