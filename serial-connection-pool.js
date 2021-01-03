const SerialPort = require('serialport');

class SerialConnectionPool {
	constructor () {
		this.connections = {};
	}

/*
 * SerialConnectionPool.connect
 * 
 * Given a port name, it searches for an existent connection. If there isn't one, it creates
 * a new one. Either way, the SerialPort object requested is given to the callback.
 * If the connection fails to open, an error is passed to the callback.
 */
	connect(portName, callback) {
		if (portName in this.connections) {
			callback(null, this.connections[portName]);
		} else {
			let newPort = new SerialPort(portName, { baudRate: 9600 });

			newPort.on('open', () => {
				callback(null, newPort)
				this.connections[portName] = newPort;
			});
			newPort.on('error', callback);
			newPort.on('close', () => {
				delete this.connections[portName];
			});
		}
	}
}

module.exports = new SerialConnectionPool();