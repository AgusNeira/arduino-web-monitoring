const router = require('express').Router();

const SerialPort = require('serialport');
const ReadLine = require('@serialport/parser-readline');
const connectionsPool = require('./serial-connection-pool.js');

module.exports = io => {

	router.get('/', async (req, res) => {
		const devices = await SerialPort.list();
		res.render('homepage', { devices });
	})

	router.get('/monitor/:port', async (req, res) => {
		const devices = await SerialPort.list();
		res.render('monitor', { devices });

		connectionsPool.connect(req.params.port, async (err, port) => {
			if (err) {
				res.render('error', { err });
				console.log(`Error connecting to ${req.params.port}`, err);
				return;
			}

			let parser = port.pipe(new ReadLine());
			
			io.on('connection', socket => {
				parser.on('data', data => socket.emit('data-sample', data));
			})
		})
	})

	return router;
}