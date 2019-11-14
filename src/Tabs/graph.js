import * as d3 from "d3";

class graph {
  constructor() {
    this.svg = d3.select("#svg");
    var svgElement = document.getElementById("svg");

    this.width = svgElement.getBoundingClientRect().width;
    this.height = svgElement.getBoundingClientRect().height;

    this.duration = 1000;
  }

  clear() {
    this.svg.html("");
  }

  buildAxes() {
    this.xScale = d3.scaleLinear().range([50, this.width - 100]);
    this.yScale = d3.scaleLinear().range([this.height - 50, 50]);

    this.xAxis = this.svg
      .append("g")
      .attr("transform", `translate(0, ${this.height - 50})`)
      .call(d3.axisBottom().scale(this.xScale));
    this.yAxis = this.svg
      .append("g")
      .attr("transform", "translate(50, 0)")
      .call(d3.axisLeft().scale(this.yScale));

    this.xLabel = this.svg
      .append("text")
      .attr("transform", `translate(${this.width / 2}, ${this.height - 10})`)
      .style("text-anchor", "middle");
    this.yLabel = this.svg
      .append("text")
      .attr("transform", `rotate(-90) translate(-${this.height / 2}, 0)`)
      .attr("dy", "1em")
      .style("text-anchor", "middle");
  }

  filterData(params) {
    this.fData = this.data.filter(
      d =>
        d[params[0]] != null &&
        d[params[1]] != null &&
        d[params[0]] > 0 &&
        d[params[1]] > 0
    );
    this.xVar = params[0];
    this.yVar = params[1];
  }

  updateAxes(params) {
    // added some filtering code
    this.filterData(params);

    // this.xScale.domain(d3.extent(data, d => +d[params[0]]));
    // this.yScale.domain(d3.extent(data, d => +d[params[1]]));

    // courtesy of https://stackoverflow.com/questions/34888205/insert-padding-so-that-points-do-not-overlap-with-y-or-x-axis
    var xExtent = d3.extent(this.fData, d => +d[this.xVar]),
      xRange = xExtent[1] - xExtent[0],
      yExtent = d3.extent(this.fData, d => +d[this.yVar]),
      yRange = yExtent[1] - yExtent[0];

    // set domain to be extent +- 5%
    this.xScale.domain([
      Math.max(xExtent[0] - xRange * 0.02, 0),
      xExtent[1] + xRange * 0.02
    ]);
    this.yScale.domain([
      Math.max(yExtent[0] - yRange * 0.02, 0),
      yExtent[1] + yRange * 0.02
    ]);

    this.xAxis
      .transition()
      .duration(this.duration)
      .call(d3.axisBottom().scale(this.xScale));
    this.yAxis
      .transition()
      .duration(this.duration)
      .call(d3.axisLeft().scale(this.yScale));

    this.xLabel
      .transition()
      .duration(this.duration)
      .text(this.xVar);
    this.yLabel
      .transition()
      .duration(this.duration)
      .text(this.yVar);
  }

  draw(params) {
    this.updateAxes(params);
  }
}

export default graph;
