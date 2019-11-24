import * as d3 from "d3";
import graph from "../graph";

// smh js doesn't have average built in
var average = arr => arr.reduce((a, b) => a + b) / arr.length;
/* A class with the methods to draw a timeseries plot using data
from the model*/
class timePlot extends graph {
  constructor() {
    super();
    this.WSs = [];
    this.isLog = false;
    this.yearRange = [];
  }

  buildAxes() {
    // we don't want our padding code here because time series graphs start from the left
    super.buildAxes();

    this.xScale = d3
      .scaleTime()
      .domain(d3.extent(this.data, d => d.date))
      .range([50, this.width - 100]);
    this.xAxis.call(d3.axisBottom().scale(this.xScale));
    this.xLabel.text("Time");

    this.path = this.svg
      .append("path")
      .style("stroke-opacity", 0)
      .attr("class", "line");

    this.pointer = this.svg
      .append("circle")
      .attr("class", "focus")
      .attr("r", 3)
      .attr("opacity", 0);
    this.focusXLine = this.svg
      .append("line")
      .attr("class", "focus")
      .attr("y1", this.yScale(this.yScale.domain()[0]))
      .attr("y2", this.yScale(this.yScale.domain()[1]))
      .attr("stroke-dasharray", "5")
      .style("opacity", 0);
    this.focusYLine = this.svg
      .append("line")
      .attr("class", "focus")
      .attr("x1", this.xScale(this.xScale.domain()[0]))
      .attr("x2", this.xScale(this.xScale.domain()[1]))
      .attr("stroke-dasharray", "5")
      .style("opacity", 0);

    this.focusXText = this.svg
      .append("text")
      .attr("class", "focus")
      .attr("y", this.height - 25);
    this.focusYText = this.svg
      .append("text")
      .attr("class", "focus")
      .attr("x", 12);
  }

  filterData(param) {
    var no_wss = this.WSs.length === 0;

    this.fData = this.data.filter(
      d =>
        d[param] != null &&
        d.date != null &&
        (no_wss || this.WSs.includes(d.WS)) &&
        (!this.yearRange[0] || d.date.getFullYear() >= this.yearRange[0]) &&
        (!this.yearRange[1] || d.date.getFullYear() <= this.yearRange[1])
    );

    console.log(this.fData);

    // get average entry by date
    this.fData = d3
      .nest()
      .key(d => d.date)
      .rollup(d => average(d.map(e => +e[param])))
      .entries(this.fData);
    // date is now in the format of a String because rollup converts Objects toString()

    // convert date back to Date object
    this.fData = this.fData.map(d => {
      d.key = new Date(d.key);
      return d;
    });

    // sort data to put dates in order
    this.fData = this.fData.sort((a, b) => b.key - a.key);
    this.xVar = "Date";
    this.yVar = param;
  }

  //changes axes based on the data being presented
  updateAxes(param) {
    // log scale update
    if (this.isLog) {
      this.yScale = d3.scaleSymlog().range([this.height - 50, 50]);
    } else {
      this.yScale = d3.scaleLinear().range([this.height - 50, 50]);
    }

    this.filterData(param);

    // courtesy of https://stackoverflow.com/questions/34888205/insert-padding-so-that-points-do-not-overlap-with-y-or-x-axis
    var yExtent = d3.extent(this.fData, d => d.value),
      yRange = yExtent[1] - yExtent[0];

    // set domain to be extent +- 5%
    this.yScale.domain([
      yExtent[0] - yRange * 0.02,
      yExtent[1] + yRange * 0.02
    ]);

    this.yAxis
      .transition()
      .duration(this.duration)
      .call(d3.axisLeft().scale(this.yScale));
  }

  buildScatter() {
    var selection = this.svg.selectAll(".bubble").data(this.fData);

    selection
      .enter()
      .append("circle")
      .attr("class", "bubble")
      .attr("r", 0)
      .style("opacity", 1)

      // update
      .merge(selection)
      .transition()
      .duration(this.duration)
      .attr("r", 3)
      .attr("cx", d => this.xScale(d.key))
      .attr("cy", d => this.yScale(d.value))
      .style("opacity", 1);

    // exit
    selection
      .exit()
      .transition()
      .duration(this.duration)
      .style("opacity", 0)
      .remove();
  }

  // courtesy of https://bl.ocks.org/gordlea/27370d1eea8464b04538e6d8ced39e89
  buildLine() {
    var line = d3
      .line()
      .x(d => this.xScale(d.key))
      .y(d => this.yScale(d.value));

    this.path
      .transition()
      .duration(this.duration)
      .style("stroke-opacity", 0.5)
      .attr("d", line(this.fData));

    this.path
      .exit()
      .transition()
      .duration(this.duration)
      .style("stroke-opacity", 0)
      .remove();
  }

  draw(param) {
    super.draw(param);
    this.buildScatter();
    this.buildLine();

    var pthis = this;
    this.svg
      .on("mousemove", function() {
        var mouse = d3.mouse(this);
        var xValue = pthis.xScale.invert(mouse[0]);
        var yValue = pthis.yScale.invert(mouse[1]);

        pthis.pointer
          .attr("opacity", 1)
          .attr("cx", mouse[0])
          .attr("cy", mouse[1]);
        pthis.focusXLine
          .style("opacity", 0.5)
          .attr("x1", mouse[0])
          .attr("x2", mouse[0]);
        pthis.focusYLine
          .style("opacity", 0.5)
          .attr("y1", mouse[1])
          .attr("y2", mouse[1]);
        pthis.focusXText
          .attr("x", mouse[0])
          .text(xValue.toLocaleDateString("en-US"));
        pthis.focusYText.attr("y", mouse[1]).text(yValue.toFixed(2));
      })
      .on("mouseout", () => {
        this.pointer.attr("opacity", 0);
        this.focusXLine.style("opacity", 0);
        this.focusYLine.style("opacity", 0);
      });
  }
}

export default timePlot;
