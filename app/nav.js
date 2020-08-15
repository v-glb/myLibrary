// #################################################################
//
//                    INITIAL STATE OF APP
//
// #################################################################

const links = document.querySelectorAll('link[rel="import"]')

// Append template to main content on app start
appendTemplatesToDOM(links);

// Set dashboard as initial page on app start
// TODO: Uncomment this!
let dashboard = document.getElementById('dashboard-section');
// let dashboard = document.getElementById('about-section');
dashboard.classList.add('is-shown');


// #################################################################
//
//                    HTML IMPORTS HANDLING
//
// #################################################################


// Import and add each page to the DOM
function appendTemplatesToDOM(templateLinks) {
  // Get all template links in index.html

  Array.prototype.forEach.call(templateLinks, (link) => {
    // Get contents of all templates with class .task-template
    let template = link.import.querySelector('.task-template');
    let clone = document.importNode(template.content, true);

    // Append template contents to DOM
    document.querySelector('.content').appendChild(clone);
  });
}

function hideSections() {
  const sections = document.querySelectorAll('.section-content.is-shown')
  Array.prototype.forEach.call(sections, (section) => {
    section.classList.remove('is-shown')
  });
}




// #################################################################
//
//                      EVENT HANDLERS
//
// #################################################################

// Handle different page templates, wether to be shown/hidden based on user click
document.getElementById('about-page').addEventListener('click', e => {

  hideSections()
  document.getElementById('about-section').classList.add('is-shown')

  // Disable search and add book functionality when viewing about page
  document.getElementById('pattern').disabled = true;
  document.getElementById('add-book').classList.add('disabled');
});


document.getElementById('dashboard-page').addEventListener('click', e => {

  hideSections()
  document.getElementById('dashboard-section').classList.add('is-shown');


  // Enable search and add book functionality when viewing main page
  document.getElementById('pattern').disabled = false;
  document.getElementById('add-book').classList.remove('disabled');
});

document.getElementById('settings-page').addEventListener('click', e => {

  hideSections()
  document.getElementById('settings-section').classList.add('is-shown');

  document.getElementById('pattern').disabled = true;
  document.getElementById('add-book').classList.add('disabled');
});

// Highlight active page in side menu
const menuItems = document.querySelectorAll('.menu-item');

menuItems.forEach((el) => {

  el.addEventListener('click', e => {

    // Remove highlight from previous element
    let currentActive = document.querySelector('li.active'); // Get only active list element!
    currentActive.classList.remove('active');

    // Add highlight to clicked element
    el.classList.add('active');

  });
});