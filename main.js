const path = require('path');

const SERIAL_PORT = process.argv[2] || 'COM3';
const SERVER_PORT = process.argv[3] || 3000;

// Serial port configuration
const SerialPort = require('serialport');
const ReadLine = require('@serialport/parser-readline');
const port = new SerialPort(SERIAL_PORT, { baudRate: 9600 }, err => {
	if (err)
		console.log(`No se pudo conectar a ${SERIAL_PORT}:`, err.message);
	else console.log(`Conexión serial establecida en ${SERIAL_PORT}`);
});
const parser = port.pipe(new ReadLine());

// Server configuration
const express = require('express');
const nodeSassMiddleware = require('node-sass-middleware');
const app = express();

// SASS configuration
app.use(nodeSassMiddleware({
	src: path.join(__dirname, 'sass'),
	dest: path.join(__dirname, 'public'),
	outputStyle: 'compressed'
}));

// Provee archivos de forma estática de las carpetas listada abajo
app.use(express.static('public'));
app.use(express.static('node_modules'));

const httpServer = require('http').createServer(app);
let io = require('socket.io')(httpServer);

httpServer.listen(SERVER_PORT, () => console.log(`Servidor escuchando en localhost:${SERVER_PORT}`));

io.on('connect', socket => {
	console.log('Conexión de sockets establecido');

	parser.on('data', data => {
		socket.emit('data-sample', data);
	});
});