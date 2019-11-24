import * as d3 from "d3";
import graph from "../graph";

var boxWidth = 50;
/* The class contains methods
to pull data from the model and draw the box plot */
class boxPlot extends graph {
  // creates the axes for a plot based on the scale of the screen
  buildAxes() {
    super.buildAxes();

    this.xScale = d3.scaleBand().range([50, this.width - 100]);
    this.xAxis.call(d3.axisBottom().scale(this.xScale));
  }

  filterData(param) {
    this.fData = this.data.filter(d => d[param] != null);
    this.dData = d3
      .nest()
      .key(d => d.date.getFullYear())
      .rollup(d => d.map(e => e[param]).sort((a, b) => a - b))
      .entries(this.fData)
      .sort((a, b) => +a.key - +b.key);

    this.xVar = "date";
    this.yVar = param;
  }

  //updates the axes when data is actually graphed
  updateAxes(param) {
    super.updateAxes(param);

    this.xScale.domain(this.dData.map(d => d.key));
    this.xAxis
      .transition()
      .duration(this.duration)
      .call(d3.axisBottom().scale(this.xScale));
  }

  //create the boxplot with or without outliers dependent on bool outliers
  draw(param, drawOutliers) {
    super.draw(param);
    // courtesy of http://bl.ocks.org/jensgrubert/7789216
    var selection = this.svg.selectAll(".plot").data(this.dData);
    var group = selection
      .enter()
      .append("g")
      .attr("class", "plot");

    // make proportional whisker/box widths
    boxWidth = this.xScale.bandwidth() * 0.6;

    this.drawWhiskers(group, drawOutliers);
    this.drawBox(group, drawOutliers);

    var updateGroup = group
      .merge(selection)
      .transition()
      .duration(this.duration)
      .attr(
        "transform",
        d => `translate(${this.xScale(d.key) + this.xScale.bandwidth() / 2}, 0)`
      );

    this.updateWhiskers(updateGroup, drawOutliers);
    this.updateBox(updateGroup, drawOutliers);

    selection
      .exit()
      .transition()
      .duration(this.duration)
      .attr("transform", d => `translate(${this.width}, 0)`)
      .remove();

    // if (drawOutliers) {
    //   //Note: Outliers is the parameter, outlier is the actual list of points that will be plotted
    //   // find outliers

    //   var outliers = array.filter(
    //     d => d < q[1] - 1.5 * iqr || d > q[3] + 1.5 * iqr
    //   );

    //   // remove outliers
    //   array = array.filter(d => !outliers.includes(d));

    //   this.drawOutliers(group, outliers);
    // }
  }

  // start of box plotting functions
  drawWhiskers(group, drawOutliers) {
    group
      .append("line")
      .attr("class", "line")
      .attr("x1", 0)
      .attr("y1", d => this.yScale(d3.quantile(d.value, 0)))
      .attr("x2", 0)
      .attr("y2", d => this.yScale(d3.quantile(d.value, 1)));
  }

  drawBox(group, drawOutliers) {
    // box
    group
      .append("rect")
      .attr("class", "box")
      .attr("width", boxWidth)
      .attr("x", -boxWidth / 2)
      .attr("y", d => this.yScale(d3.quantile(d.value, 0.75)))
      .attr(
        "height",
        d =>
          this.yScale(d3.quantile(d.value, 0.25)) -
          this.yScale(d3.quantile(d.value, 0.75))
      );

    // median
    group
      .append("line")
      .attr("class", "median")
      .attr("x1", -boxWidth / 2)
      .attr("y1", d => this.yScale(d3.quantile(d.value, 0.5)))
      .attr("x2", boxWidth / 2)
      .attr("y2", d => this.yScale(d3.quantile(d.value, 0.5)));
  }

  updateWhiskers(group, drawOutliers) {
    group
      .select(".line")
      .attr("x1", 0)
      .attr("y1", d => this.yScale(d3.quantile(d.value, 0)))
      .attr("x2", 0)
      .attr("y2", d => this.yScale(d3.quantile(d.value, 1)));
  }

  updateBox(group, drawOutliers) {
    group
      .select(".box")
      .attr("width", boxWidth)
      .attr("x", -boxWidth / 2)
      .attr("y", d => this.yScale(d3.quantile(d.value, 0.75)))
      .attr(
        "height",
        d =>
          this.yScale(d3.quantile(d.value, 0.25)) -
          this.yScale(d3.quantile(d.value, 0.75))
      );

    group
      .select(".median")
      .attr("x1", -boxWidth / 2)
      .attr("y1", d => this.yScale(d3.quantile(d.value, 0.5)))
      .attr("x2", boxWidth / 2)
      .attr("y2", d => this.yScale(d3.quantile(d.value, 0.5)));
  }

  //a method to be invoked if the outliers should be drawn as points
  //dependent on a toggle on the page
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
