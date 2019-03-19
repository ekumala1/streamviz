var tabs;
var data;

var currentTab;

var width;
var height;

var params = [];

window.onload = function() {
  tabs = document.getElementsByClassName('tab-content');
  tabButtons = document.getElementsByClassName('tab-button');

  $.getJSON('database.php', function(results) {
    data = results;
    console.log(data);

    // just for testing (switch this back to raw if not set)
    viewTab('scatter');
  });
};

function viewTab(tabName) {
  for (let i = 0; i < tabs.length; i++) {
    if (tabs[i].id == tabName) {
      tabs[i].style.display = null;
      tabButtons[i].className += ' active';
    } else {
      tabs[i].style.display = 'none';
      tabButtons[i].className = tabButtons[i].className.replace(' active', '');
    }
  }

  if (tabName == 'raw') {
    loadRaw();
  } else if (tabName == 'scatter') {
    loadScatter();
    loadScatterOptions();
  }

  currentTab = tabName;
}

function loadRaw() {
  var table = document.getElementById('rawTable');

  // add in headers
  var tr = '<tr>';
  for (var key in data[0]) {
    tr += `<th>${key}</th>`;
  }
  tr += '</tr>';

  // add in all rows
  for (var i = 0; i < Object.keys(data).length; i++) {
    tr += '<tr>';

    for (var key in data[i]) tr += `<td>${data[i][key]}</td>`;

    tr += '</tr>';
  }

  table.innerHTML = tr;
}

function loadScatterOptions() {
  svar1.innerHTML = '';
  svar2.innerHTML = '';
  for (key in data[0]) {
    svar1.innerHTML += `<option value="${key}">${key}</option>`;
    svar2.innerHTML += `<option value="${key}">${key}</option>`;
  }
}

function loadScatter() {
  var svar1 = document.getElementById('svar1');
  var svar2 = document.getElementById('svar2');

  var svg = d3.select('#scattersvg');
  var svgElement = document.getElementById('scattersvg');
  width = svgElement.getBoundingClientRect().width;
  height = svgElement.getBoundingClientRect().height;
  svgElement.innerHTML = '';

  var xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, d => +d[params[0]]))
    .range([50, this.width - 100]);

  var yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, d => +d[params[1]]))
    .range([this.height - 50, 50]);

  var x = d3.axisBottom().scale(xScale);
  var y = d3.axisLeft().scale(yScale);

  svg
    .append('g')
    .attr('transform', `translate(0, ${this.height - 50})`)
    .call(x);
  svg
    .append('g')
    .attr('transform', 'translate(50, 0)')
    .call(y);

  var selection = svg.selectAll('.bubble').data(data, d => d);

  selection
    .enter()
    .append('circle')
    .attr('class', 'bubble')
    .attr('r', 3)
    .attr('cx', d => xScale(+d[params[0]]))
    .attr('cy', d => yScale(+d[params[1]]))
    .style('fill', 'orange')
    .style('opacity', 0.5);
}

function setParam(index, value) {
  params[index] = value;

  if (params[0] != null && params[1] != null) {
    loadScatter();
  }
}
