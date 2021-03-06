
window.onload = function () {
	let port = document.getElementById('chart-container').dataset.port;
	let charts = [];
	for (let i = 0; i < 4; i++) {
		charts.push(new Chart('#chart-container', 100, {
			width: 500, height: 250,
			margin: { top: 50, right: 30, bottom: 30, left: 50 }
		}));
	}

	const socket = io();

	socket.on('connect', () => console.log('succesfully connected to server'));

	socket.on(`data-sample-${port}`, sample => {
		let now = new Date();
		let values = sample.split(';').map(str => parseInt(str));
		if (values.length !== 4) console.log('ERROR');

		charts.forEach((chart, index) => chart.pushSample({date: now, value: values[index]}));
	})
}