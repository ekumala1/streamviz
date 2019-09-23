import * as d3 from 'd3';

class scatterPlot {
  constructor() {
    this.svg = d3.select('#svg');
    var svgElement = document.getElementById('svg');

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

    this.axisHorizontal = this.svg
      .append('text')
      .attr('transform', `translate(${this.width / 2}, ${this.height - 10})`)
      .style('text-anchor', 'middle')
      .text('');

    this.axisVertical = this.svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0)
      .attr('x', 0 - this.height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('');
  }

  updateAxes(params, isLog) {
    // added some filtering code
    this.fData = this.data.filter(
      d => d[params[0]] != null && d[params[1]] != null && d[params[0]] > 0 && d[params[1]] > 0
    );
    if (isLog) {
        this.xScale = d3.scaleLog().range([50, this.width - 100]);
        this.yScale = d3.scaleLog().range([this.height - 50, 50]);
    } else {
        this.xScale = d3.scaleLinear().range([50, this.width - 100]);
        this.yScale = d3.scaleLinear().range([this.height - 50, 50]);
    }

    // this.xScale.domain(d3.extent(data, d => +d[params[0]]));
    // this.yScale.domain(d3.extent(data, d => +d[params[1]]));

    // courtesy of https://stackoverflow.com/questions/34888205/insert-padding-so-that-points-do-not-overlap-with-y-or-x-axis
    var xExtent = d3.extent(this.fData, d => +d[params[0]]),
      xRange = xExtent[1] - xExtent[0],
      yExtent = d3.extent(this.fData, d => +d[params[1]]),
      yRange = yExtent[1] - yExtent[0];

    // set domain to be extent +- 5%
    this.xScale.domain([
      Math.max(xExtent[0] - xRange * 0.02, 1),
      xExtent[1] + xRange * 0.02
    ]);
    this.yScale.domain([
      Math.max(yExtent[0] - yRange * 0.02, 1),
      yExtent[1] + yRange * 0.02
    ]);
    console.log([
        Math.max(yExtent[0] - yRange * 0.02, 0),
        yExtent[1] + yRange * 0.02
    ])

    this.xSelect
      .transition()
      .duration(this.duration)
      .call(d3.axisBottom().scale(this.xScale));
    this.ySelect
      .transition()
      .duration(this.duration)
      .call(d3.axisLeft().scale(this.yScale));

    this.axisHorizontal
      .transition()
      .duration(this.duration)
      .text(params[0]);
    this.axisVertical
      .transition()
      .duration(this.duration)
      .text(params[1]);

  }

  buildScatter(params, isLog) {
    this.updateAxes(params, isLog);

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

export default scatterPlot;
