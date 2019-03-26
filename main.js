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
    // had to add this in to process dates from MySQL
    data.forEach(d => (d.Date = new Date(d.Date)));
    console.log(data);

    // just for testing (switch this back to raw if not set)
    viewTab('raw');
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
  } else if (tabName == 'time') {
    loadTime();
  } else if (tabName == 'box') {
    loadBox();
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
  var svar1 = document.getElementById('svar1');
  var svar2 = document.getElementById('svar2');

  svar1.innerHTML = '';
  svar2.innerHTML = '';
  for (key in data[0]) {
    svar1.innerHTML += `<option value="${key}">${key}</option>`;
    svar2.innerHTML += `<option value="${key}">${key}</option>`;
  }
}

function loadScatter() {
  loadScatterOptions();

  scatter = new scatterPlot(data);
  scatter.clear();
  scatter.buildAxes();
}

function loadTimeOptions() {
  var tvar = document.getElementById('tvar');

  tvar.innerHTML = '';
  for (key in data[0])
    tvar.innerHTML += `<option value="${key}">${key}</option>`;
}

function loadTime() {
  loadTimeOptions();

  time = new timePlot(data);
  time.clear();
  time.buildAxes();
}

function loadBoxOptions() {
  var bvar = document.getElementById('bvar');

  bvar.innerHTML = '';
  for (key in data[0])
    bvar.innerHTML += `<option value="${key}">${key}</option>`;
}

function loadBox() {
  loadBoxOptions();

  box = new boxPlot(data);
  box.clear();
  box.buildAxes();
}

function setParam(index, value) {
  params[index] = value;

  if (currentTab == 'scatter' && params[0] != null && params[1] != null) {
    scatter.buildScatter(params);
  } else if (currentTab == 'time') {
    time.buildLinePlot(params);
  } else if (currentTab == 'box') {
    // remove outer wrapper array
    params = params[index];
    box.buildBox(params);
  }
}
