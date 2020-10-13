// Line chart
const width = 600;
const height = 300;
const margin = {top: 50, right: 40, bottom: 30, left: 40};

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

	svg.append('path')						// Line
		.attr('id', 'chart-line')
		.attr('d', line(data));

	svg.append('g')								// X-axis
		.attr('transform', `translate(0, ${height - margin.bottom})`)
		.call(d3.axisBottom(xScale));

	svg.append('g')								// Y-axis
		.attr('transform', `translate(${margin.left}, 0)`)
		.call(d3.axisLeft(yScale));

	function dataEntryFromMousePosition(x) {
		let date = xScale.invert(x);
		let index = d3.bisector(d => d.date).left(data, date);
		let a = data[index - 1];
		let b = data[index];

		if (b && (date - a.date > b.date - date)) return b;
		return a;
	}

	let tooltip = svg.append('g')
		.attr('id', 'tooltip');
	tooltip.append('rect')
		.attr('width', 54).attr('height', '35px')
		.attr('x', -27).attr('y', '-45px')
		.attr('rx', 5).attr('ry', 5);
	tooltip.append('line')
		.attr('x0', 0).attr('y0', 0)
		.attr('x1', 0).attr('y1', -10);
	tooltip.append('circle')
		.attr('r', 2);
	tooltip.append('text').attr('id', 'date-text');
	tooltip.append('text').attr('id', 'value-text');

	function updateTooltip (g, dataEntry) {
		if (!dataEntry) return g.style('display', 'none');

		g
			.style('display', null)
			.style('pointer-events', 'none')
			.style('text-anchor', 'middle');

		g.select('text#date-text')
			.text(d3.timeFormat('%H:%M:%S')(dataEntry.date))
			.attr('x', 0)
			.attr('y', '-15px')
		g.select('text#value-text')
			.text(dataEntry.value)
			.attr('x', 0)
			.attr('y', '-30px');
	}

	svg.on('touchmove mousemove', event => {
		const {date, value} = dataEntryFromMousePosition(d3.pointer(event)[0]);

		tooltip
			.attr('transform', `translate(${xScale(date)}, ${yScale(value)})`)
			.call(updateTooltip, {date, value});
	});
	svg.on('touchleave mouseleave', () => tooltip.call(updateTooltip, null));

	return svg;
}

window.onload = function() {
	const svg = d3.select('body')
		.append('svg')
		.attr('id', 'chart')
		.attr('viewBox', [0, 0, width, height])
		.attr('width', '900px')
		.attr('height', '450px');

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
