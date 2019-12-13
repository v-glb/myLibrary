// #################################################################
//
//                INITIAL STATE ON APP START
//
// #################################################################

// Initial state with book dashboard when app starts
setInitialState();

// #################################################################
//
//                HTML IMPORTS HANDLING
//
// #################################################################

function setInitialState() {
  // Get the link element that references the dashboard.html file
  const initialDashboard = document.getElementById('dashboard');

  // Retrieve the loaded template
  const dashboardTemplate = initialDashboard.import;

  // Get the template
  const dashboard = dashboardTemplate.getElementById('dashboard');

  // Clone template content
  const dashboardClone = document.importNode(dashboard.content, true);

  // Add content of dashboard.html template to page
  document.getElementById('content').appendChild(dashboardClone);

  // Make content visible
  document.querySelector('.content').classList.add('is-shown')
}