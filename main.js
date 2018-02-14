const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const Tray = electron.Tray;
const nativeImage = electron.nativeImage

const Menu = electron.Menu;


const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

const autoUpdater = require("electron-updater").autoUpdater;
const log = require('electron-log');

function sendStatusToWindow(text) {
  log.info(text);
  mainWindow.webContents.send('message', text);
}

function updater() {
  autoUpdater.logger = log;
  autoUpdater.logger.transports.file.level = 'info';
  log.info('App starting...');

  autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Checking for update...');
  })
  autoUpdater.on('update-available', (info) => {
    sendStatusToWindow('Update available.');
  })
  autoUpdater.on('update-not-available', (info) => {
    sendStatusToWindow('Update not available.');
  })
  autoUpdater.on('error', (err) => {
    sendStatusToWindow('Error in auto-updater. ' + err);
  })
  autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    sendStatusToWindow(log_message);
  })
  autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWindow('Update downloaded');
    autoUpdater.on('update-downloaded', (info) => {
      autoUpdater.quitAndInstall();  
    })
  });

  
  autoUpdater.checkForUpdatesAndNotify()

}

function createWindow () {
  console.log(process.env.ELECTRON_ENV)

  // Create the browser window.
  let winOpts = {
    width: 340, 
    height: 300, 
    frame: false,
    titleBarStyle: 'customButtonsOnHover', 
    title: '',
  };

  if(process.env.ELECTRON_ENV == 'development') {
    winOpts = Object.assign(winOpts, {
      width: 800,
      height: 600,
    })
  }
  mainWindow = new BrowserWindow(winOpts)

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true,
    partition: 'persist:main',
  }))

  var template = [{
    label: "Who's Hacking",
    submenu: [
        // { label: "About", selector: "orderFrontStandardAboutPanel:" },
        // { type: "separator" },
        { label: "Quit", accelerator: "Command+Q", click: function() { app.quit(); }}
    ]}, {
    label: "Edit",
    submenu: [
        { label: "Undo", accelerator: "CmdOrCtrl+Z", selector: "undo:" },
        { label: "Redo", accelerator: "Shift+CmdOrCtrl+Z", selector: "redo:" },
        { type: "separator" },
        { label: "Cut", accelerator: "CmdOrCtrl+X", selector: "cut:" },
        { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
        { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" },
        { label: "Select All", accelerator: "CmdOrCtrl+A", selector: "selectAll:" }
    ]},
    { label: "Dev",
    submenu: [
      {role: 'toggledevtools'},
    ]},
  ];

  // Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  electron.Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  // Open the DevTools.
  if(process.env.ELECTRON_ENV == 'development') {
    mainWindow.webContents.openDevTools()
  }

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow()
  autoUpdater.checkForUpdatesAndNotify();
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
