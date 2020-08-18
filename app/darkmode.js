// #################################################################
//
//                      DARK MODE HANDLING
//
// #################################################################

const { ipcRenderer } = require("electron");

// Apply dark theme based on switch status
document.getElementById('dark-mode-switch-status').addEventListener('change', e => {
  darkModeToggler();
});


function darkModeToggler() {
  // Dark background for whole page
  document.querySelector('html').classList.toggle('dark-theme-bg');

  // Slightly less dark background for cards, sections etc.
  const cardList = document.querySelectorAll('.card');
  cardList.forEach(el => {
    el.classList.toggle('dark-theme-card-bg');
  });

  const cardLargeList = document.querySelectorAll('.white');
  cardLargeList.forEach(el => {
    el.classList.toggle('dark-theme-card-bg');
  });

  const collectionList = document.querySelectorAll('.collection-item');
  collectionList.forEach(el => {
    el.classList.toggle('dark-theme-card-bg');
    el.classList.toggle('dark-theme-font');
  });

  document.querySelector('.navbar-fixed').classList.toggle('dark-theme-card-bg');
  document.querySelector('.jsCalendar table').classList.toggle('dark-theme-card-bg');
  document.querySelector('.modal').classList.toggle('dark-theme-card-bg');
  document.querySelector('.modal-footer').classList.toggle('dark-theme-card-bg');

  // White font
  const pList = document.querySelectorAll('p');
  pList.forEach(el => {
    el.classList.toggle('dark-theme-font');
  });

  const tdList = document.querySelectorAll('td');
  tdList.forEach(el => {
    el.classList.toggle('dark-theme-font');
  });

  const thList = document.querySelectorAll('th');
  thList.forEach(el => {
    el.classList.toggle('dark-theme-font');
  });


  const iList = document.querySelectorAll('i');
  iList.forEach(el => {
    el.classList.toggle('dark-theme-font');
  });

  const h4List = document.querySelectorAll('h1, h2, h3, h4, h5');
  h4List.forEach(el => {
    el.classList.toggle('dark-theme-font');
  });

  // Send information about current design to main process so correct windows
  // get rendered
  ipcRenderer.send('design:toggle');
}