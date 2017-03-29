const { app, ipcMain, BrowserWindow } = require('electron')
const Menubar = require('menubar')
const path = require('path')
const url = require('url')
const fs = require('fs')

const allRecipes = '../recipes.json'
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
})

// const createWindow = () => {
//   mainWindow = new BrowserWindow({width: 800, height: 600})
//
//   mainWindow.loadURL
// )
//   mainWindow.webContents.openDevTools()
//
//   mainWindow.on('closed', function () {
//
//     mainWindow = null
//   })
// }

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

// const getRecipes = () => {
//   return JSON.parse(fs.readFileSync(allRecipes))
// }

// const writeRecipes = () => {
//
// }

// ipcMain.on('load', () => {
//   getRecipes
// })
//
// app.on('ready', () => {
//   createWindow
//   getRecipes
// })

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
