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
  // moved this up here (interesting detail is that it still worked even though it was defined in loadScatter?!)
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

function setParam(index, value) {
  params[index] = value;

  if (params[0] != null && params[1] != null) {
    scatter.buildScatter(params);
  }
}
