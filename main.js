const path = require('path');

const SERIAL_PORT = process.argv[2] || 'COM3';
const SERVER_PORT = process.argv[3] || 3000;

// Serial port configuration
const SerialPort = require('serialport');
const ReadLine = require('@serialport/parser-readline');

// The serial connection establishes after the server, in order to select the port
/*
const port = new SerialPort(SERIAL_PORT, { baudRate: 9600 }, err => {
	if (err)
		console.log(`No se pudo conectar a ${SERIAL_PORT}:`, err.message);
	else console.log(`Conexión serial establecida en ${SERIAL_PORT}`);
});
const parser = port.pipe(new ReadLine());
*/

// Server configuration
const express = require('express');
const app = express();
app.set('view engine', 'pug');

// SASS configuration
const nodeSassMiddleware = require('node-sass-middleware');
app.use(nodeSassMiddleware({
	src: path.join(__dirname, 'sass'),
	dest: path.join(__dirname, 'public'),
	outputStyle: 'compressed'
}));

// Routes
let routes = require('./routes.js');
app.use(routes);

// Provee archivos de forma estática de las carpetas listadas abajo
app.use(express.static('public'));
app.use(express.static('node_modules'));

const httpServer = require('http').createServer(app);

httpServer.listen(SERVER_PORT, () => {
	console.log(`Servidor escuchando en localhost:${SERVER_PORT}`)
	
	let io = require('socket.io')(httpServer);

	io.on('connect', async socket => {
		console.log('Conexión de sockets establecido');

		// List all available ports and send them to the client
		let devices = await SerialPort.list();
		socket.emit('devices', devices);
	});
});
