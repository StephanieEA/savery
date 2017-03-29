const Menubar = require('menubar')
const electron = require('electron')
const fs = require('fs')
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
const recipes = recipe_file.json

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

//ipcMain.on('page load'), it will receive something from the ipcRenderer
//probably the notification that the page has loaded, so it can get the information
//from the json file (getRecipes). These will then display. or just export the function

const getRecipes = () => {
  return JSON.parse(fs.readFileSync(recipes))
}

const writeRecipes = (food) => {
  let allFood = food.all_recipes.map()
  //if the new recipe isn't already in allFood, push it in.
  //stringify
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

exports.getRecipes = getRecipes
