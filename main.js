var tabs;
var data;

var currentTab;

window.onload = function() {
  tabs = document.getElementsByClassName('tab-content');
  tabButtons = document.getElementsByClassName('tab-button');

  $.getJSON('database.php', function(results) {
    data = results;
    console.log(data);

    viewTab('raw');
    loadRaw();
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
