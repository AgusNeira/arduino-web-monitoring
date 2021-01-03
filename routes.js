const router = require('express').Router();
const SerialPort = require('serialport');

router.get('/', async (req, res) => {
	const devices = await SerialPort.list();
	res.render('homepage', { devices });
})

router.get('/monitor/:port', async (req, res) => {
	const devices = await SerialPort.list();
	res.render('monitor', { devices });
})

module.exports = router;