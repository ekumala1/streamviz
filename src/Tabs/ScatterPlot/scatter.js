import * as d3 from 'd3';
import * as ss from 'simple-statistics'; // for calculating regression line
import graph from '../graph';

class scatterPlot extends graph {
  constructor() {
    super();
    this.isLog = false;
    this.drawLine = false;
  }

  buildAxes() {
    super.buildAxes();

    this.bubbles = this.svg.append('g').attr('class', 'bubbles');

    this.line = this.svg
      .append('path')
      .attr('class', 'line')
      .style('stroke-opacity', 0);
    this.pointer = this.svg
      .append('circle')
      .attr('class', 'focus')
      .attr('r', 3)
      .attr('opacity', 0);

    this.focusXLine = this.svg
      .append('line')
      .attr('class', 'focus')
      .attr('y1', this.yScale(this.yScale.domain()[0]))
      .attr('y2', this.yScale(this.yScale.domain()[1]))
      .attr('stroke-dasharray', '5')
      .style('opacity', 0);
    this.focusYLine = this.svg
      .append('line')
      .attr('class', 'focus')
      .attr('x1', this.xScale(this.xScale.domain()[0]))
      .attr('x2', this.xScale(this.xScale.domain()[1]))
      .attr('stroke-dasharray', '5')
      .style('opacity', 0);

    this.focusXText = this.svg
      .append('text')
      .attr('class', 'focus')
      .attr('y', this.height - 25);
    this.focusYText = this.svg
      .append('text')
      .attr('class', 'focus')
      .attr('x', 12);
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

      this.line
        .transition()
        .duration(this.duration)
        .attr('d', line(points))
        .style('stroke-opacity', 1);
    } else {
      this.line
        .transition()
        .duration(this.duration)
        .style('stroke-opacity', 0);
    }
  }

  draw(params) {
    super.draw(params);
    this.toggleLine();

    var pthis = this;
    this.svg
      .on('mousemove', function() {
        var mouse = d3.mouse(this);

        // get coordinates of crosshair
        var xValue = pthis.xScale.invert(mouse[0]); // always at mouse's X value
        var yValue = pthis.drawLine
          ? pthis.bestFitFunc(xValue)
          : pthis.xScale.invert(mouse[1]); // if line, snap y to line, else, at mouse's Y value
        var yPixel = pthis.drawLine ? pthis.yScale(yValue) : mouse[1];

        pthis.pointer
          .attr('opacity', 1)
          .attr('cx', mouse[0])
          .attr('cy', yPixel);
        pthis.focusXLine
          .style('opacity', 0.5)
          .attr('x1', mouse[0])
          .attr('x2', mouse[0]);
        pthis.focusYLine
          .style('opacity', 0.5)
          .attr('y1', yPixel)
          .attr('y2', yPixel);
        pthis.focusXText
          .style('opacity', 1)
          .attr('x', mouse[0])
          .text(xValue.toFixed(2));
        pthis.focusYText
          .style('opacity', 1)
          .attr('y', yPixel)
          .text(yValue.toFixed(2));
      })
      .on('mouseout', () => {
        this.pointer.attr('opacity', 0);
        this.focusXLine.style('opacity', 0);
        this.focusYLine.style('opacity', 0);
        this.focusXText.style('opacity', 0);
        this.focusYText.style('opacity', 0);
      });

    var selection = this.bubbles.selectAll('.bubble').data(this.fData);
    var group = this.svg.append('g').attr('class', 'tooltips');

    var handleMouseOver = (d, i) => {
      // d3.select(this).attr("r", 10);
      group
        .append('text')
        .attr('id', 't' + i)
        .attr('class', 'tooltip')
        .attr('x', this.xScale(+d[params[0]]) + 10)
        .attr('y', this.yScale(+d[params[1]]) - 10)
        .text(d.WSID);
    };
    var handleMouseOut = (d, i) => {
      group.select('#t' + i).remove();
    };

    // enter
    selection
      .enter()
      .append('circle')
      .attr('class', 'bubble')
      .attr('r', 0)
      .style('opacity', 0.5)
      .on('mouseover', handleMouseOver)
      .on('mouseout', handleMouseOut)

      // update
      .merge(selection)
      .transition()
      .duration(this.duration)
      .attr('r', 3)
      .attr('cx', d => this.xScale(+d[params[0]]))
      .attr('cy', d => this.yScale(+d[params[1]]));

    // exit
    selection
      .exit()
      .transition()
      .duration(this.duration)
      .style('opacity', 0)
      .remove();
  }
}

export default scatterPlot;
