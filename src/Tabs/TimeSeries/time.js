import * as d3 from "d3";

// smh js doesn't have average built in
var average = arr => arr.reduce((a, b) => a + b) / arr.length;
/* A class with the methods to draw a timeseries plot using data
from the model*/
class timePlot {
  constructor() {
    this.svg = d3.select("#svg");
    var svgElement = document.getElementById("svg");

    this.width = svgElement.getBoundingClientRect().width;
    this.height = svgElement.getBoundingClientRect().height;

    this.WSIDs = [];
    this.duration = 1000;
  }

  clear() {
    this.svg.html("");
  }

  buildAxes() {
    // we don't want our padding code here because time series graphs start from the left
    this.xScale = d3
      .scaleTime()
      // .domain([0, 1])
      .domain(d3.extent(this.data, d => d.date))
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
      .text("Time");

    this.axisVertical = this.svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0)
      .attr("x", 0 - this.height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("");

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

  updateAxes() {
    // this.xScale.domain(d3.extent(data, d => +d[params[0]]));
    // this.yScale.domain(d3.extent(data, d => +d[params[1]]));

    // courtesy of https://stackoverflow.com/questions/34888205/insert-padding-so-that-points-do-not-overlap-with-y-or-x-axis
    var yExtent = d3.extent(this.fData, d => d.value),
      yRange = yExtent[1] - yExtent[0];

    // set domain to be extent +- 5%
    this.yScale.domain([
      yExtent[0] - yRange * 0.02,
      yExtent[1] + yRange * 0.02
    ]);

    this.ySelect
      .transition()
      .duration(this.duration)
      .call(d3.axisLeft().scale(this.yScale));
  }

  filterData(params) {
    this.axisVertical.text(params[0]);
    var no_wsids = this.WSIDs.length === 0;
    this.fData = this.data.filter(
      d =>
        d[params[0]] != null &&
        d.date != null &&
        (no_wsids || this.WSIDs.includes(d.WSID))
    );

    // get average entry by date
    this.fData = d3
      .nest()
      .key(d => d.date)
      .rollup(d => {
        var values = d.map(e => +e[params[0]]);
        return average(values);
      })
      .entries(this.fData);
    // date is now in the format of a String because rollup converts Objects toString()

    // convert date back to Date object
    this.fData = this.fData.map(d => {
      d.key = new Date(d.key);
      return d;
    });

    // sort data to put dates in order
    this.fData = this.fData.sort((a, b) => b.key - a.key);
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
      .attr("cy", d => this.yScale(d.value));

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

    d3.selectAll(".line")
      .transition()
      .duration(this.duration)
      .style("stroke-opacity", 0)
      .remove();

    var path = this.svg
      .append("path")
      .datum(this.fData)
      .style("stroke-opacity", 0)
      .attr("class", "line")
      .attr("d", line);

    path
      .transition()
      .duration(this.duration)
      .style("stroke-opacity", 0.5);
  }

  buildLinePlot(params) {
    this.filterData(params);
    this.updateAxes();
    this.buildLine();
    this.buildScatter();

    var pthis = this;
    this.svg
      .on("mousemove", function() {
        var mouse = d3.mouse(this);
        var xValue = pthis.xScale.invert(mouse[0]);
        var yValue = pthis.yScale.invert(mouse[1]);
        console.log(xValue);

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
