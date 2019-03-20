class boxPlot {
  constructor(data) {
    this.svg = d3.select('#boxsvg');
    var svgElement = document.getElementById('boxsvg');

    this.data = data;
    this.width = svgElement.getBoundingClientRect().width;
    this.height = svgElement.getBoundingClientRect().height;

    this.duration = 1000;
  }

  clear() {
    this.svg.html('');
  }

  buildAxes() {
    this.xScale = d3
      .scaleBand()
      .domain([])
      .range([50, this.width - 100]);

    this.yScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([this.height - 50, 50]);

    this.xSelect = this.svg
      .append('g')
      .attr('transform', `translate(0, ${this.height - 50})`)
      .call(d3.axisBottom().scale(this.xScale));
    this.ySelect = this.svg
      .append('g')
      .attr('transform', 'translate(50, 0)')
      .call(d3.axisLeft().scale(this.yScale));
  }

  updateAxes(params) {
    // added some filtering code
    this.fData = this.data.filter(d => {
      for (var param in params) if (d[param] == null) return false;

      return true;
    });

    this.xScale.domain(params);
    // this.yScale.domain(d3.extent(data, d => +d[params[1]]));

    this.yScale.domain([0, 100]);

    this.xSelect
      .transition()
      .duration(this.duration)
      .call(d3.axisBottom().scale(this.xScale));
    this.ySelect
      .transition()
      .duration(this.duration)
      .call(d3.axisLeft().scale(this.yScale));
  }

  buildBox(params) {
    // courtesy of http://bl.ocks.org/jensgrubert/7789216
    this.updateAxes(params);

    var g = d3.selectAll('.box').append('g');
    this.drawWhiskers(g);
  }

  // start of box plotting functions
  drawWhiskers(group) {
    group
      .append('line')
      .attr('class', 'whisker')
      .attr('x1', 0)
      .attr('y1', x0)
      .attr('x2', 0 + width)
      .attr('y2', x0);
  }
}
