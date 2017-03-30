const { app, ipcMain, BrowserWindow } = require('electron')
const Menubar = require('menubar')
const path = require('path')
const url = require('url')
const fs = require('fs')

const allRecipes = 'recipes.json'
const windows = new Set()
const menubar = Menubar({
  width:300,
  height:400,
  icon: './images/kitchen-fork-icon.png'
})

let mainWindow

menubar.on('ready', () => {
  console.log('READY!');
})

menubar.on('after-create-window', () => {
  menubar.window.loadURL(url.format({
    pathname: path.join(__dirname, '../index.html'),
    protocol: 'file:',
    slashes: true
    })
  )
  ipcMain.on('load', (event, data) => {
    console.log(data);
    event.sender.send('load', 'loaded')
  })
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

const getRecipes = exports.getRecipes = () => {
  return JSON.parse(allRecipes)
}
//
// const writeRecipes = (dishes, instructions) => {
//   let newRecipes = dishes.all_recipes.map(recipe => {
//     return recipe
//   })
//   dishes.all_recipes = newRecipes
//   dishes.all_recipes.push(instructions)
//   fs.writeFileSync(allRecipes, JSON.stringify(dishes, null, 1))
// }
//
// const saveRecipes = (content) => {
//   writeRecipes(getRecipes(), content)
// }

ipcMain.on('load', (event, data) => {
  // getRecipes(data)
  event.sender.send('load', 'loaded')
})

ipcMain.on('currentRecipe', (event, data) => {
  // sendRecipes(data)
  event.sender.send('hello')
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
