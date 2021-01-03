const router = require('express').Router();

const SerialPort = require('serialport');
const ReadLine = require('@serialport/parser-readline');
const connectionsPool = require('./serial-connection-pool.js');

module.exports = io => {

	router.get('/', async (req, res) => {
		const devices = await SerialPort.list();
		res.render('homepage', { devices });
	})

	router.get('/monitor', async (req, res) => {
		const devices = await SerialPort.list();
		res.render('monitor', { devices });

		if (!'port' in req.query) {
			res.render('error', { err: new Error('Port name not specified in query')});
			return
		}

		connectionsPool.connect(req.query.port, async (err, port) => {
			if (err) {
				res.render('error', { err });
				console.log(`Error connecting to ${req.query.port}`, err);
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