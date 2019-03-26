var whiskerWidth = 10;
var boxWidth = 20;

class boxPlot {
  constructor(data) {
    this.svg = d3.select('#boxsvg');
    var svgElement = document.getElementById('boxsvg');

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
      .scaleBand()
      .domain([])
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
    this.fData = this.data.filter(d => {
      for (var i in params) if (d[params[i]] == null) return false;

      return true;
    });

    var temp = [];
    for (var i in params) {
      temp = temp.concat(this.fData.map(d => +d[params[i]]));
    }

    this.xScale.domain(params);
    this.yScale.domain(d3.extent(temp));

    this.xSelect
      .transition()
      .duration(this.duration)
      .call(d3.axisBottom().scale(this.xScale));
    this.ySelect
      .transition()
      .duration(this.duration)
      .call(d3.axisLeft().scale(this.yScale));
  }

  buildBox(params) {
    // courtesy of http://bl.ocks.org/jensgrubert/7789216
    this.updateAxes(params);
    this.svg.selectAll('.boxplot').remove();

    for (var i in params) {
      var g = this.svg
        .append('g')
        .attr('class', 'boxplot')
        .attr(
          'transform',
          `translate(${this.xScale(params[i]) +
            this.xScale.bandwidth() / 2 -
            boxWidth / 2}, 0)`
        );
      this.drawWhiskers(g, params[i]);
    }
  }

  // start of box plotting functions
  drawWhiskers(group, param) {
    var array = this.fData.map(d => +d[param]);
    array = array.sort((a, b) => a - b);

    var quantiles = [0, 0.25, 0.5, 0.75, 1];
    quantiles = quantiles.map(d => d3.quantile(array, d));
    console.log(quantiles);

    var offset = (boxWidth - whiskerWidth) / 2;

    group
      .append('line')
      .attr('class', 'line')
      .attr('x1', offset)
      .attr('y1', this.yScale(quantiles[0]))
      .attr('x2', whiskerWidth + offset)
      .attr('y2', this.yScale(quantiles[0]));

    group
      .append('line')
      .attr('class', 'line')
      .attr('x1', boxWidth / 2)
      .attr('y1', this.yScale(quantiles[0]))
      .attr('x2', boxWidth / 2)
      .attr('y2', this.yScale(quantiles[4]));

    group
      .append('line')
      .attr('class', 'line')
      .attr('x1', offset)
      .attr('y1', this.yScale(quantiles[4]))
      .attr('x2', whiskerWidth + offset)
      .attr('y2', this.yScale(quantiles[4]));
  }
}
