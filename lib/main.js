const Menubar = require('menubar')
const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const windows = new Set()

const createGroceryList = exports.createGroceryList = (file) => {
  let groceryWindow = new BrowserWindow({show: false})
  windows.add(groceryWindow)
  
  groceryWindow.loadURL(url.format({
    pathname: path.join(__dirname, '../grocery-list.html'),
    protocol: 'file:',
    slashes: true
  }))

  groceryWindow.once('ready-to-show', () => {
    if (file) openFile(groceryWindow, file)
    groceryWindow.show()
  })

  return groceryWindow
}

const path = require('path')
const url = require('url')
const menubar = Menubar({
  width:300,
  height:400,
  icon: './images/kitchen-fork-icon.png'
})

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

menubar.on('ready', () => {
  console.log('READY!');
})

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '../index.html'),
    protocol: 'file:',
    slashes: true
  }))

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {

    mainWindow = null
  })
}

app.on('ready', createWindow)

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
