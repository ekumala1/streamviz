var tabs;
var data;

var currentTab;

var width;
var height;

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

function loadScatter() {
  var svg = d3.select('#scattersvg');
  width = document.getElementById('scattersvg').getBoundingClientRect().width;
  height = document.getElementById('scattersvg').getBoundingClientRect().height;

  var xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, d => +d.Conductivity))
    .range([50, this.width - 100]);

  var yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, d => +d.Turbidity))
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
    .attr('cx', d => xScale(+d.Conductivity))
    .attr('cy', d => yScale(+d.Turbidity))
    .style('fill', 'orange')
    .style('opacity', 0.5);
}
