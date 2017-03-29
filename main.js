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

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
const recipes = recipe_file.json

menubar.on('ready', () => {
  console.log('READY!')
});

app.on('ready', createWindow)

const createWindow () => {
  mainWindow = new BrowserWindow({width: 800, height: 600})

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

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

exports.getRecipes = getRecipes
