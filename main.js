var tabs;
var data;

var currentTab;

window.onload = function() {
  tabs = document.getElementsByClassName('tab-content');
  tabButtons = document.getElementsByClassName('tab-button');

  viewTab('raw');
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
