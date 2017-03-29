const Menubar = require('menubar')
const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

const path = require('path')
const url = require('url')
const menubar = Menubar({
  width:300,
  height:400,
  icon: './images/kitchen-fork-icon.png'
})

let mainWindow

const windows = new Set()

const createGroceryList = exports.createGroceryList = (file) => {
  let groceryWindow = new BrowserWindow({show: false})
  windows.add(groceryWindow)
  groceryWindow.loadURL('file://' + __dirname + '/grocery-list.html')

  groceryWindow.once('ready-to-show', () => {
    if (file) openFile(groceryWindow, file)
    groceryWindow.show()
  })

  return groceryWindow
}

function createWindow () {
  mainWindow = new BrowserWindow({width: 800, height: 600})

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  })
)
  mainWindow.webContents.openDevTools()

  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', () => {
  createWindow()})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
