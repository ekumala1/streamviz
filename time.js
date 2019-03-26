// smh js doesn't have average built in
average = arr => arr.reduce((a, b) => a + b) / arr.length;

class timePlot {
  constructor(data) {
    this.svg = d3.select('#timesvg');
    var svgElement = document.getElementById('timesvg');

    this.data = data;
    this.width = svgElement.getBoundingClientRect().width;
    this.height = svgElement.getBoundingClientRect().height;

    this.duration = 1000;
  }

  clear() {
    this.svg.html('');
  }

  buildAxes() {
    // we don't want our padding code here because time series graphs start from the left
    this.xScale = d3
      .scaleTime()
      // .domain([0, 1])
      .domain(d3.extent(this.data, d => d.Date))
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
    this.fData = this.data.filter(d => d[params[0]] != null);

    // get average entry by date
    this.fData = d3
      .nest()
      .key(d => d.Date)
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
    console.log(this.fData);
  }

  buildScatter() {
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
      .attr('cx', d => this.xScale(d.key))
      .attr('cy', d => this.yScale(d.value))
      .style('opacity', 1);

    enter
      .transition()
      .duration(this.duration)
      .attr('r', 3);
  }

  // courtesy of https://bl.ocks.org/gordlea/27370d1eea8464b04538e6d8ced39e89
  buildLine() {
    var line = d3
      .line()
      .x(d => this.xScale(d.key))
      .y(d => this.yScale(d.value));

    d3.selectAll('.line')
      .transition()
      .duration(this.duration)
      .style('stroke-opacity', 0)
      .remove();

    var path = this.svg
      .append('path')
      .datum(this.fData)
      .style('stroke-opacity', 0)
      .attr('class', 'line')
      .attr('d', line);

    path
      .transition()
      .duration(this.duration)
      .style('stroke-opacity', 0.5);
  }

  buildLinePlot(params) {
    this.filterData(params);
    this.updateAxes();
    this.buildLine();
    this.buildScatter();
  }
}
