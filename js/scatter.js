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
    // added some filtering code
    this.fData = this.data.filter(
      d => d[params[0]] != null && d[params[1]] != null
    );

    // this.xScale.domain(d3.extent(data, d => +d[params[0]]));
    // this.yScale.domain(d3.extent(data, d => +d[params[1]]));

    // courtesy of https://stackoverflow.com/questions/34888205/insert-padding-so-that-points-do-not-overlap-with-y-or-x-axis
    var xExtent = d3.extent(this.fData, d => +d[params[0]]),
      xRange = xExtent[1] - xExtent[0],
      yExtent = d3.extent(this.fData, d => +d[params[1]]),
      yRange = yExtent[1] - yExtent[0];

    // set domain to be extent +- 5%
    this.xScale.domain([
      xExtent[0] - xRange * 0.02,
      xExtent[1] + xRange * 0.02
    ]);
    this.yScale.domain([
      yExtent[0] - yRange * 0.02,
      yExtent[1] + yRange * 0.02
    ]);

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

    var selection = this.svg.selectAll('.bubble').data(this.fData, d => d);

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
      .style('opacity', 0.5);

    enter
      .transition()
      .duration(this.duration)
      .attr('r', 3);
  }
}
