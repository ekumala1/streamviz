import * as d3 from "d3";
import * as ss from "simple-statistics"; // for calculating regression line
import graph from "../graph";

class scatterPlot extends graph {
  constructor() {
    super();
    this.isLog = false;
    this.drawLine = false;
    this.WSs = [];
    this.yearRange = [];
  }

  buildAxes() {
    super.buildAxes();

    this.bubbles = this.svg.append("g").attr("class", "bubbles");

    this.line = this.svg
      .append("path")
      .attr("class", "line")
      .style("stroke-opacity", 0);
    this.correlation = this.svg
      .append("text")
      .attr("class", "focus")
      .attr("x", this.width - 150)
      .attr("y", 70);
  }

  filterData(params) {
    super.filterData(params);

    var no_wss = this.WSs.length === 0;
    this.fData = this.fData.filter(
      d =>
        (no_wss || this.WSs.includes(d.WS)) &&
        (!this.yearRange[0] || d.date.getFullYear() >= this.yearRange[0]) &&
        (!this.yearRange[1] || d.date.getFullYear() <= this.yearRange[1])
    );
  }

  updateAxes(params) {
    if (this.isLog) {
      this.xScale = d3.scaleSymlog().range([50, this.width - 100]);
      this.yScale = d3.scaleSymlog().range([this.height - 50, 50]);
    } else {
      this.xScale = d3.scaleLinear().range([50, this.width - 100]);
      this.yScale = d3.scaleLinear().range([this.height - 50, 50]);
    }
    super.updateAxes(params);

    this.bestFit = ss.linearRegression(
      this.fData.map(d => [+d[this.xVar], +d[this.yVar]])
    );
    this.bestFitFunc = ss.linearRegressionLine(this.bestFit);
  }

  toggleLine() {
    if (this.drawLine) {
      var points = this.xScale
        .domain()
        .map(d => ({ x: d, y: this.bestFitFunc(d) }));

      var line = d3
        .line()
        .x(d => this.xScale(d.x))
        .y(d => this.yScale(d.y));
      var correlation = ss.rSquared(
        this.fData.map(d => [+d[this.xVar], +d[this.yVar]]),
        this.bestFitFunc
      );

      this.line
        .transition()
        .duration(this.duration)
        .attr("d", line(points))
        .style("stroke-opacity", 1);
      this.correlation.text(correlation.toFixed(2));
    } else {
      this.line
        .transition()
        .duration(this.duration)
        .style("stroke-opacity", 0);
      this.correlation.text("");
    }
  }

  draw(params) {
    super.draw(params);
    this.toggleLine();

    var pthis = this;
    this.svg.on("mousemove", function() {
      var mouse = d3.mouse(this);

      if (
        mouse[0] > pthis.xScale.range()[0] &&
        mouse[0] < pthis.xScale.range()[1] &&
        mouse[1] > pthis.yScale.range()[1] &&
        mouse[1] < pthis.yScale.range()[0]
      ) {
        // get coordinates of crosshair
        var xValue = pthis.xScale.invert(mouse[0]); // always at mouse's X value
        var yValue = pthis.drawLine
          ? pthis.bestFitFunc(xValue)
          : pthis.xScale.invert(mouse[1]); // if line, snap y to line, else, at mouse's Y value
        var yPixel = pthis.drawLine ? pthis.yScale(yValue) : mouse[1];

        pthis.pointer
          .attr("opacity", 1)
          .attr("cx", mouse[0])
          .attr("cy", yPixel);
        pthis.focusXLine
          .style("opacity", 0.5)
          .attr("x1", mouse[0])
          .attr("x2", mouse[0]);
        pthis.focusYLine
          .style("opacity", 0.5)
          .attr("y1", yPixel)
          .attr("y2", yPixel);
        pthis.focusXText
          .style("opacity", 1)
          .attr("x", mouse[0])
          .text(xValue.toFixed(2));
        pthis.focusYText
          .style("opacity", 1)
          .attr("y", yPixel)
          .text(yValue.toFixed(2));
      } else {
        pthis.pointer.attr("opacity", 0);
        pthis.focusXLine.style("opacity", 0);
        pthis.focusYLine.style("opacity", 0);
        pthis.focusXText.style("opacity", 0);
        pthis.focusYText.style("opacity", 0);
      }
    });

    var selection = this.bubbles.selectAll(".bubble").data(this.fData);
    var group = this.svg.append("g").attr("class", "tooltips");

    var handleMouseOver = (d, i) => {
      // d3.select(this).attr("r", 10);
      group
        .append("text")
        .attr("id", "t" + i)
        .attr("class", "tooltip")
        .attr("x", this.xScale(+d[params[0]]) + 10)
        .attr("y", this.yScale(+d[params[1]]) - 10)
        .text(d.WSID);
    };
    var handleMouseOut = (d, i) => {
      group.select("#t" + i).remove();
    };

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
      .attr("cx", d => this.xScale(+d[params[0]]))
      .attr("cy", d => this.yScale(+d[params[1]]));

    // exit
    selection
      .exit()
      .transition()
      .duration(this.duration)
      .style("opacity", 0)
      .remove();
  }
}

export default scatterPlot;
