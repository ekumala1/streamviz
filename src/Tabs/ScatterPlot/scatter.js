import * as d3 from "d3";
import * as ss from "simple-statistics";

class scatterPlot {
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
    this.xScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([50, this.width - 100]);

    this.yScale = d3
      .scaleLinear()
      .domain([0, 1])
      .range([this.height - 50, 50]);

    this.xSelect = this.svg
      .append("g")
      .attr("transform", `translate(0, ${this.height - 50})`)
      .call(d3.axisBottom().scale(this.xScale));
    this.ySelect = this.svg
      .append("g")
      .attr("transform", "translate(50, 0)")
      .call(d3.axisLeft().scale(this.yScale));

    this.axisHorizontal = this.svg
      .append("text")
      .attr("transform", `translate(${this.width / 2}, ${this.height - 10})`)
      .style("text-anchor", "middle")
      .text("");

    this.axisVertical = this.svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0)
      .attr("x", 0 - this.height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("");

    this.line = this.svg
      .append("path")
      .attr("class", "line")
      .style("stroke-opacity", 0);
  }

  updateAxes(params, isLog) {
    // added some filtering code
    this.fData = this.data.filter(
      d =>
        d[params[0]] != null &&
        d[params[1]] != null &&
        d[params[0]] > 0 &&
        d[params[1]] > 0
    );

    if (isLog) {
      this.xScale = d3.scaleSymlog().range([50, this.width - 100]);
      this.yScale = d3.scaleSymlog().range([this.height - 50, 50]);
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
      Math.max(xExtent[0] - xRange * 0.02, 0),
      xExtent[1] + xRange * 0.02
    ]);
    this.yScale.domain([
      Math.max(yExtent[0] - yRange * 0.02, 0),
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

    this.axisHorizontal
      .transition()
      .duration(this.duration)
      .text(params[0]);
    this.axisVertical
      .transition()
      .duration(this.duration)
      .text(params[1]);

    this.bestFit = ss.linearRegression(
      this.fData.map(d => [+d[params[0]], +d[params[1]]])
    );
    this.bestFitFunc = ss.linearRegressionLine(this.bestFit);
  }

  buildScatter(params, isLog, enableLine) {
    this.updateAxes(params, isLog);
    this.toggleLine(enableLine);

    var selection = this.svg.selectAll(".bubble").data(this.fData);
    var group = this.svg.append("g").attr("class", "tooltips");
    var xScale = this.xScale;
    var yScale = this.yScale;

    function handleMouseOver(d, i) {
      // d3.select(this).attr("r", 10);
      group
        .append("text")
        .attr("id", "t" + i)
        .attr("class", "tooltip")
        .attr("x", xScale(+d[params[0]]) + 10)
        .attr("y", yScale(+d[params[1]]) - 10)
        .text(d.WSID);
    }
    function handleMouseOut(d, i) {
      group.select("#t" + i).remove();
    }

    // enter
    selection
      .enter()
      .append("circle")
      .attr("class", "bubble")
      .attr("r", 0)
      .style("opacity", 0.5)
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)

      // update
      .merge(selection)
      .transition()
      .duration(this.duration)
      .attr("r", 3)
      .attr("cx", d => xScale(+d[params[0]]))
      .attr("cy", d => yScale(+d[params[1]]));

    // exit
    selection
      .exit()
      .transition()
      .duration(this.duration)
      .style("opacity", 0)
      .remove();
  }

  toggleLine(enable) {
    if (enable) {
      var points = this.xScale
        .domain()
        .map(d => ({ x: d, y: this.bestFitFunc(d) }));

      var line = d3
        .line()
        .x(d => this.xScale(d.x))
        .y(d => this.yScale(d.y));

      this.line
        .transition()
        .duration(this.duration)
        .attr("d", line(points))
        .style("stroke-opacity", 1);
    } else {
      this.line
        .transition()
        .duration(this.duration)
        .style("stroke-opacity", 0);
    }
  }
}

export default scatterPlot;
