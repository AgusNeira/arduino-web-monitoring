const path = require('path');

const SERVER_PORT = process.argv[3] || 3000;

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

const httpServer = require('http').createServer(app);
const io = require('socket.io')(httpServer);

// Routes
let routes = require('./routes.js')(io);
app.use(routes);

// Provee archivos de forma estática de las carpetas listadas abajo
app.use(express.static('public'));
app.use(express.static('node_modules'));

httpServer.listen(SERVER_PORT, () => {
	console.log(`Servidor escuchando en localhost:${SERVER_PORT}`)
});
