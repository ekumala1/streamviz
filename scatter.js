class scatterPlot {
  constructor(data) {
    this.svg = d3.select('#scattersvg');
    var svgElement = document.getElementById('scattersvg');

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
      .scaleLinear()
      .domain([0, 1])
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
    this.xScale.domain(d3.extent(data, d => +d[params[0]]));
    this.yScale.domain(d3.extent(data, d => +d[params[1]]));

    this.xSelect
      .transition()
      .duration(this.duration)
      .call(d3.axisBottom().scale(this.xScale));
    this.ySelect
      .transition()
      .duration(this.duration)
      .call(d3.axisLeft().scale(this.yScale));
  }

  buildScatter(params) {
    this.updateAxes(params);

    var selection = this.svg.selectAll('.bubble').data(this.data, d => d);

    selection
      .exit()
      .transition()
      .duration(this.duration)
      .attr('r', 0)
      .remove();

    var enter = selection
      .enter()
      .append('circle')
      .attr('class', 'bubble')
      .attr('r', 0)
      .attr('cx', d => this.xScale(+d[params[0]]))
      .attr('cy', d => this.yScale(+d[params[1]]))
      .style('fill', 'orange')
      .style('opacity', 0.5);

    enter
      .transition()
      .duration(this.duration)
      .attr('r', 3);
  }
}
