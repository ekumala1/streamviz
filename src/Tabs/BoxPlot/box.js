import * as d3 from "d3";

var whiskerWidth = 40;
var boxWidth = 50;

class boxPlot {
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
      .scaleBand()
      .domain([])
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

    this.axisVertical = this.svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0)
      .attr("x", 0 - this.height / 2)
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Amount");
  }

  updateAxes(param) {
    // added some filtering code
    this.fData = this.data.filter(d => d[param] != null);

    var yExtent = d3.extent(this.fData, d => +d[param]),
      yRange = yExtent[1] - yExtent[0];

    var temp = [param];
    this.xScale.domain(temp);
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

  buildBox(param, outliers) {
    // courtesy of http://bl.ocks.org/jensgrubert/7789216
    this.updateAxes(param);
    this.svg
      .selectAll(".boxplot")
      .transition()
      .duration(this.duration)
      .style("fill-opacity", 0)
      .style("stroke-opacity", 0)
      .remove();

    // make proportional whisker/box widths
    whiskerWidth = this.xScale.bandwidth() * 0.3;
    boxWidth = this.xScale.bandwidth() * 0.4;
    var getParam = d => +d[param];
    var getQuantile = d => d3.quantile(array, d);
    // for every selected column
    //for (var i in params) {
    // create a group for easy manipulation
    var g = this.svg
      .append("g")
      .attr("class", "boxplot")
      .attr(
        "transform",
        `translate(${this.xScale(param) +
          this.xScale.bandwidth() / 2 -
          boxWidth / 2}, 0)`
      )
      .style("stroke-opacity", 0);

    // 1d dataset of current column
    var array = this.fData.map(getParam);
    array = array.sort((a, b) => a - b);
    console.log(this.fData);
    console.log(array);
    // find quantiles
    var q = [0, 0.25, 0.5, 0.75, 1];
    q = q.map(getQuantile);
    var iqr = q[3] - q[1];
    console.log(q);
    if (outliers) {
      //Note: Outliers is the parameter, outlier is the actual list of points that will be plotted
      // find outliers

      var outlier = array.filter(
        d => d < q[1] - 1.5 * iqr || d > q[3] + 1.5 * iqr
      );

      // remove outliers
      array = array.filter(d => !outlier.includes(d));
    }

    this.drawWhiskers(g, Math.min(...array), Math.max(...array));
    this.drawBox(g, q);
    if (outliers) {
      this.drawOutliers(g, outlier);
    }
    g.transition()
      .duration(this.duration)
      .style("stroke-opacity", 1);
  }

  // start of box plotting functions
  drawWhiskers(group, min, max) {
    var offset = (boxWidth - whiskerWidth) / 2;

    // bottom whisker
    group
      .append("line")
      .attr("class", "line")
      .attr("x1", offset)
      .attr("y1", this.yScale(min))
      .attr("x2", whiskerWidth + offset)
      .attr("y2", this.yScale(min));

    // line between whiskers
    group
      .append("line")
      .attr("class", "line")
      .attr("x1", boxWidth / 2)
      .attr("y1", this.yScale(min))
      .attr("x2", boxWidth / 2)
      .attr("y2", this.yScale(max));

    // top whisker
    group
      .append("line")
      .attr("class", "line")
      .attr("x1", offset)
      .attr("y1", this.yScale(max))
      .attr("x2", whiskerWidth + offset)
      .attr("y2", this.yScale(max));
  }

  drawBox(group, quantiles) {
    // box
    group
      .append("rect")
      .attr("class", "box")
      .attr("width", boxWidth)
      .attr("y", this.yScale(quantiles[3]))
      .attr("height", this.yScale(quantiles[1]) - this.yScale(quantiles[3]));

    // median
    group
      .append("line")
      .attr("class", "line")
      .attr("x1", 0)
      .attr("y1", this.yScale(quantiles[2]))
      .attr("x2", boxWidth)
      .attr("y2", this.yScale(quantiles[2]));
  }

  drawOutliers(group, outliers) {
    console.log("drawing " + outliers.length + " outliers");
    var selection = group.selectAll(".bubble").data(outliers);
    var offset = boxWidth / 2;

    var enter = selection
      .enter()
      .append("circle")
      .attr("class", "bubble")
      .attr("r", 0)
      .attr("cx", offset)
      .attr("cy", d => this.yScale(d))
      .style("opacity", 0.5);

    enter
      .transition()
      .duration(this.duration)
      .attr("r", 3);
  }
  // end of box plotting functions
}

export default boxPlot;
