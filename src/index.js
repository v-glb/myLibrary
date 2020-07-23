const { app, BrowserWindow, Menu, ipcMain, dialog, screen } = require('electron');
const fs = require('fs'); // Write files via node.js

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

// Small borderless window for adding new books
function createAddBookWindow() {
  // Create the browser window.
  addBookWindow = new BrowserWindow({
    width: 600,
    height: 400,
    title: 'Add New Book',
    frame: false,
    x: screen.getDisplayNearestPoint(screen.getCursorScreenPoint()).bounds.x,
    y: screen.getDisplayNearestPoint(screen.getCursorScreenPoint()).bounds.y,
    show: false,
    webPreferences: { nodeIntegration: true }
  });

  addBookWindow.center();

  // Prevent ugly visual flash because when creating the window
  addBookWindow.once('ready-to-show', () => {
    addBookWindow.show();
  });

  // and load the index.html of the app.
  addBookWindow.loadURL(`file://${__dirname}/../html/addBook.html`);

  // Dereference / Garbage Collection of addBookWindow on close
  addBookWindow.on('closed', () => addBookWindow = null);
}

// Small borderless window for editing existing books
function createEditBookWindow() {
  editBookWindow = new BrowserWindow({
    width: 600,
    height: 500,
    title: 'Edit Book',
    frame: false,
    x: screen.getDisplayNearestPoint(screen.getCursorScreenPoint()).bounds.x,
    y: screen.getDisplayNearestPoint(screen.getCursorScreenPoint()).bounds.y,
    show: false,
    webPreferences: { nodeIntegration: true }
  });

  editBookWindow.center();

  // Prevent ugly visual flash because when creating the window
  editBookWindow.once('ready-to-show', () => {
    editBookWindow.show();
  });



  // and load the index.html of the app.
  editBookWindow.loadURL(`file://${__dirname}/../html/editBook.html`);

  // Dereference / Garbage Collection of addBookWindow on close
  editBookWindow.on('closed', () => editBookWindow = null);
}

function importBooks() {
  let importedBooks;

  // Predefined settings for openDialog
  const options = {
    title: 'Import books',
    defaultPath: app.getPath('documents'),
    filters: [
      { name: 'txt', extensions: ['txt',] },
      { name: 'All Files', extensions: ['*'] }
    ]
  }

  // Get path for saving exported books
  let fileName = dialog.showOpenDialog(mainWindow, options) // returns a Promise!

    // Get promise and get filePath from it
    .then(result => {
      // Get full path with name of file 
      fileName = result.filePaths.toString();

      // read file contens with fs
      fs.readFile(fileName, (err, contents) => {
        if (err) {
          console.log('an error ocurred with file creation ' + err.message);
          return;
        }

        // Get books from read file
        importedBooks = contents.toString();

        // Send to renderer process for setting localStorage with file contents
        mainWindow.webContents.send('books:import', importedBooks);
      });
    })

    // Error handling
    .catch(err => {
      console.log(err)
    });
}


// ###################################################################
// 
//                        IPC HANDLING
//
// ###################################################################


// Send newly created book to mainWindow for rendering
ipcMain.on('book:add', (e, newBook) => {
  mainWindow.webContents.send('book:add', newBook);
  addBookWindow.close();
});

// Initiate book editing process
ipcMain.on('book:edit', (e, title, author, isbn) => {
  createEditBookWindow();

  // Time needed for creating the edit window before we can send book info there
  setTimeout(() => { editBookWindow.webContents.send('book:edit', title, author, isbn); }, 400);
});

// Send finished book editing to mainWindow for rendering the new info
ipcMain.on('book:editDone', e => {
  mainWindow.webContents.send('book:editDone');
  editBookWindow.close();
});

// Launch save dialogue when exporting localStorage in Renderer process is done
ipcMain.on('books:exportDone', (e, books) => {
  console.log(books);

  // Predefined settings for saving dialogue
  const options = {
    title: 'Export books',
    defaultPath: app.getPath('documents') + '/myLibrary-backup.txt',
    filters: [
      { name: 'txt', extensions: ['txt',] },
      { name: 'All Files', extensions: ['*'] }
    ]
  }

  // Get path for saving exported books
  let fileName = dialog.showSaveDialog(mainWindow, options) // returns a Promise!

    // Get promise and get filePath from it
    .then(result => {
      // Get full path with name of file
      fileName = result.filePath;

      // Actual saving via fs and returned filePath
      fs.writeFileSync(fileName, books, (err) => {
        if (err) {
          console.log('an error ocurred with file creation ' + err.message);
          return;
        }
        console.log('File creation successfully!');
      });

    })

    // Error handling
    .catch(err => {
      console.log(err)
    })
});

// Create new book via button click in navbar
ipcMain.on('book:new', e => {
  createAddBookWindow();
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
        label: 'Export Books',
        click() {
          mainWindow.webContents.send('books:export');
        }
      },
      {
        label: 'Import Books',
        click() {
          // Call function to read file contens and send to renderer process
          // for setting localStorage
          importBooks();

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

// Check if we're in prod or dev mode for toggling dev tools visibility
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