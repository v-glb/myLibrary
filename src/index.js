const { app, BrowserWindow, Menu, ipcMain } = require('electron');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) { // eslint-disable-line global-require
  app.quit();
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;
let addBookWindow;
let editBookWindow;

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: { nodeIntegration: true }
  });

  // and load the index.html of the app.
  mainWindow.loadURL(`file://${__dirname}/index.html`);

  // Create custom menu
  const mainMenu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(mainMenu);

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
    app.quit();
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// Handle creation  of addBookWindow

function createAddBookWindow() {
  // Create the browser window.
  addBookWindow = new BrowserWindow({
    width: 600,
    height: 400,
    title: 'Add New Book',
    frame: false,
    webPreferences: { nodeIntegration: true }
  });

  // and load the index.html of the app.
  addBookWindow.loadURL(`file://${__dirname}/../html/addBook.html`);

  // Dereference / Garbage Collection of addBookWindow on close
  addBookWindow.on('closed', () => addBookWindow = null);
}

function createEditBookWindow() {
  editBookWindow = new BrowserWindow({
    width: 600,
    height: 400,
    title: 'Edit Book',
    frame: false,
    webPreferences: { nodeIntegration: true }
  });

  // and load the index.html of the app.
  editBookWindow.loadURL(`file://${__dirname}/../html/editBook.html`);

  // Dereference / Garbage Collection of addBookWindow on close
  editBookWindow.on('closed', () => editBookWindow = null);

}


// ###################################################################
// 
//                        IPC HANDLING
//
// ###################################################################

ipcMain.on('book:add', (e, newBook) => {
  mainWindow.webContents.send('book:add', newBook);
  addBookWindow.close();
});

ipcMain.on('book:edit', (e, title, author, isbn) => {
  createEditBookWindow();

  // Time needed for creating the edit window before we can send contents there
  setTimeout(() => { editBookWindow.webContents.send('book:edit', title, author, isbn); }, 400);
});

ipcMain.on('book:editDone', e => {
  mainWindow.webContents.send('book:editDone');
  editBookWindow.close();
});


// ###################################################################
// 
//                    MENU DEFINITIONS
//
// ###################################################################

const menuTemplate = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New Book',
        accelerator: process.platform === 'darwin' ? 'Command+N' : 'Ctrl+N',
        click() {
          createAddBookWindow();
        }
      },
      {
        label: 'Quit',
        accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click() {
          app.quit();
        }
      }
    ]
  }
];

// Handle 'Electron' instead of 'File' problem on OSX platforms
if (process.platform === 'darwin') {
  menuTemplate.unshift({});
}

// Check if we're in prod or dev mode for toggling dev tools
if (process.env.NODE_ENV !== 'production') {
  menuTemplate.push({
    label: 'View',
    submenu: [
      { role: 'reload' },
      {
        label: 'Toggle Developer Tools',
        accelerator: process.platform === 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      }
    ]
  });
}