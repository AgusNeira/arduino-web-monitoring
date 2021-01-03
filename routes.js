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

		if (!('port' in req.query)) {
			res.render('error', { devices, err: new Error('Port name not specified in query')});
			return
		}
		let portPath = req.query.port;

		connectionsPool.connect(portPath, async (err, port) => {
			if (err) {
				res.render('error', { devices, err });
				console.log(`Error connecting to ${portPath}`, err);
				return;
			}

			let parser = port.pipe(new ReadLine());
			
			io.on('connection', socket => {
				parser.on('data', data => socket.emit(`data-sample-${portPath}`, data));
			})

			res.render('monitor', { devices, port: portPath });
		})
	})

	return router;
}