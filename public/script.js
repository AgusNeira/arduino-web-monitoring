// Line chart
const width = 600;
const height = 300;
const margin = {top: 10, right: 20, bottom: 30, left: 40};

const maxLength = 100;

let data = [{
	date: new Date(),
	value: 0
}];

function draw(svg) {
	svg.selectAll('*').remove();

	let xScale = d3.scaleTime()
		.domain(d3.extent(data, d => d.date))
		.range([margin.left, width - margin.right]);

	let yScale = d3.scaleLinear()
		.domain(d3.extent(data, d => d.value))
		.range([height - margin.bottom, margin.top]);

	let line = d3.line()
		.defined(d => !isNaN(d.value))
		.x(d => xScale(d.date))
		.y(d => yScale(d.value));

	svg.append('path')
		.attr('stroke', 'orange')
		.attr('stroke-width', 1.5)
		.attr('stroke-linejoin', 'round')
		.attr('stroke-linecap', 'round')
		.attr('d', line(data))
		.attr('fill', 'none');

	svg.append('g')
		.attr('transform', `translate(0, ${height - margin.bottom})`)
		.call(d3.axisBottom(xScale));

	svg.append('g')
		.attr('transform', `translate(${margin.left}, 0)`)
		.call(d3.axisLeft(yScale));

	return svg;
}

window.onload = function() {
	const svg = d3.select('#chart')
		.append('svg')
		.attr('viewBox', [0, 0, width, height])
		.attr('width', 600)
		.attr('height', 300);

	draw(svg);

	// Socket.IO connection
	function appendToContent(text) {
		let element = document.createElement('p');
		element.innerText = text;
		document.getElementById('content').appendChild(element);
	}

	const socket = io();

	socket.on('connect', () => {
		appendToContent('Established socket connection');
	})

	socket.on('data-sample', sample => {
		data.push({
			date: new Date(Date.parse(sample.date)),
			value: sample.value
		});
		if (data.length > 100) data.shift();

		console.log('I\'m trying to update...');
		draw(svg);
	})
};
