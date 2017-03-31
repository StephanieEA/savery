const { app, ipcMain, BrowserWindow } = require('electron')
const Menubar = require('menubar')
const path = require('path')
const url = require('url')
const fs = require('fs')

let baseRecipe = null
const allRecipes = 'recipes.json'
const windows = new Set()
const menubar = Menubar({
  width:360,
  height:400,
  icon: './images/kitchen-fork-icon.png'
})

menubar.on('ready', () => {
  console.log('READY?! OK!');
})

menubar.on('after-create-window', () => {
  menubar.window.loadURL(url.format({
    pathname: path.join(__dirname, '../index.html'),
    protocol: 'file:',
    slashes: true
    })
  )//.then(promise => () => {
  //
  //   return menubar.window.webContents.send('load', baseRecipe)
  // })
  // ipcMain.on('load', (event, arg) => {
  //   event.sender.send('load', baseRecipe)
  // })
//  menubar.window.webContents.openDevTools();
})



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

const saveRecipe = (data) => {
  if (!data) {return }
  writeRecipe(readRecipe(), data)
}

const readRecipe = () => {
  return JSON.parse(fs.readFileSync('recipes.json'))
}

const writeRecipe = (recipes, newRecipe) => {
  recipes.all_recipes.push(newRecipe)
  fs.writeFileSync('recipes.json', JSON.stringify(recipes, null, 2))
}

// Listen for load message from renderer process
ipcMain.on('load', (event, arg) => {
  //  Print response
    if (arg !== null) return
   else {
  //  Reply on load message from renderer process
    event.sender.send('load', fs.readFileSync('recipes.json'));
  }
});

ipcMain.on('currentRecipe', (event, data) => {
  saveRecipe(data)
})

menubar.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

menubar.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})
