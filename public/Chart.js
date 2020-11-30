class Chart {
	constructor(parentSelector, maxLength, sizes) {
		this.data = [{
			date: new Date(),
			value: 0
		}];
		this.maxLength = maxLength;
		this.width = sizes.width;
		this.height = sizes.height;
		this.margin = sizes.margin;
		this.mousePosition;

		this.svg = d3.select(parentSelector).append('svg')
			.attr('class', 'chart')
			.attr('viewBox', [0, 0, this.width, this.height])
			.attr('preserveAspectRatio', 'xMidYMid meet');

		this.xScale = d3.scaleTime()
			.range([this.margin.left, this.width - this.margin.right]);

		this.yScale = d3.scaleLinear()
			.range([this.height - this.margin.bottom, this.margin.top]);

		this.line = d3.line()
			.defined(d => !isNaN(d.value))
			.x(d => this.xScale(d.date))
			.y(d => this.yScale(d.value))

		this.svg.append('path').attr('class', 'chart-line');

		this.svg.append('g').attr('class', 'x-scale')
			.attr('transform', `translate(0, ${this.height - this.margin.bottom})`);

		this.svg.append('g').attr('class', 'y-scale')
			.attr('transform', `translate(${this.margin.left}, 0)`);

		this.svg.append('g').attr('class', 'tooltip').call(this.tooltip);

		this.svg.on('touchmove mousemove', event => {
			this.mousePosition = d3.pointer(event)[0];
			let dataEntry = this.dataEntryFromMousePosition(this.mousePosition);
			if (dataEntry)
				this.svg.select('g.tooltip').call(g => this.updateTooltip(g, dataEntry));
		});
		this.svg.on('touchleave mouseleave', event => {
			this.svg.select('g.tooltip').call(g => this.updateTooltip(g, null));
			this.mousePosition = null;
		});

		this.render();
	}

	render() {
		this.xScale.domain(d3.extent(this.data, sample => sample.date));
		this.yScale.domain(d3.extent(this.data, sample => sample.value));

		this.svg.select('path.chart-line').attr('d', this.line(this.data));
		this.svg.select('g.x-scale').call(d3.axisBottom(this.xScale));
		this.svg.select('g.y-scale').call(d3.axisLeft(this.yScale));

		if (this.mousePosition) {
			let dataEntry = this.dataEntryFromMousePosition(this.mousePosition);
			if (dataEntry)
				this.svg.select('g.tooltip').call(g => this.updateTooltip(g, dataEntry));
		}
	}

	/*
	 * Agrega un par de valores al gráfico.
	 * Mantiene el largo del array por debajo del máximo establecido,
	 * y renderiza nuevamente el gráfico.
	 */
	pushSample (sample) {
		this.data.push(sample);
		if (this.data.length == this.maxLength) this.data.shift();
		this.render();
	}

	/**
	 * Sirve para utilizar el tooltip. Toma la posición en x del mouse,
	 * y averigua sobre qué muestra se está parando
	 */
	dataEntryFromMousePosition(x) {
		if (x < this.margin.left) return null;

		let leDate = this.xScale.invert(x);
		let index = d3.bisector(sample => sample.date).left(this.data, leDate);
		
		if (index === 0) return this.data[0];

		let a = this.data[index - 1];
		let b = this.data[index];

		if (b && (b.date - leDate < leDate - a.date)) return b;
		return a;
	}

	tooltip(g) {
		g.append('rect')
			.attr('width', 54).attr('height', 35)
			.attr('x', -27).attr('y', -45)
			.attr('rx', 5).attr('ry', 5);
		g.append('line').attr('y1', -10);
		g.append('circle').attr('r', 2);
		g.append('text').attr('class', 'date-text').attr('y', -15);
		g.append('text').attr('class', 'value-text').attr('y', -30);
		g.append('line').attr('class', 'horizontal-projection');
		g.append('line').attr('class', 'vertical-projection');
	}
	updateTooltip(g, dataEntry) {
		if (!dataEntry) return g.style('display', 'none');
		
		g.style('display', null)
			.attr('transform', `translate(${this.xScale(dataEntry.date)}, ${this.yScale(dataEntry.value)})`)

		g.select('text.date-text')
			.text(d3.timeFormat('%H:%M:%S')(dataEntry.date));
		g.select('text.value-text')
			.text(dataEntry.value);
		g.select('line.horizontal-projection')
			.attr('x1', -this.xScale(dataEntry.date) + this.margin.left);
		g.select('line.vertical-projection')
			.attr('y2', this.height - this.margin.bottom - this.yScale(dataEntry.value));
	}
}