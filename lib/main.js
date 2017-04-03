const { app, ipcMain, BrowserWindow, dialog } = require('electron')
const Menubar = require('menubar')
const electron = require('electron')
const path = require('path')
const url = require('url')
const fs = require('fs')

let baseRecipe = null
const allRecipes = 'recipes.json'
const allGroceries = 'grocery-list.json'
const windows = new Set()
const menubar = Menubar({
  width:680,
  height:800,
  icon: './images/kitchen-fork-icon.png'
})
let mainWindow

menubar.on('ready', () => {
  console.log('READY?! OK!');
})

menubar.on('after-create-window', () => {
  menubar.window.loadURL(url.format({
    pathname: path.join(__dirname, '../index.html'),
    protocol: 'file:',
    slashes: true,
    })
  )
})

const createGroceryList = exports.createGroceryList = (file) => {
  let groceryWindow = new BrowserWindow({
    show: false,
    x:0,
    y:0
  })
  windows.add(groceryWindow)

  groceryWindow.loadURL(url.format({
    pathname: path.join(__dirname, '../grocery-list.html'),
    protocol: 'file:',
    slashes: true
    })
  )

  groceryWindow.once('ready-to-show', () => {
    if (file) openFile(groceryWindow, file)
    groceryWindow.show()
  })

  return groceryWindow
}

const saveFile = (content) => {
  let fileName = dialog.showSaveDialog(mainWindow, {
    title: 'Save Grocery List',
    defaultPath: app.getPath('documents'),
    filters: [
      { name: 'Grocery List', extensions: ['pdf'] }
    ]
  });

  fs.writeFileSync(fileName, content);
}

const createMainWindow = exports.createMainWindow = (file) => {
  let mainWindow = new BrowserWindow({ show:false })
  windows.add(mainWindow)

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '../index.html'),
    protocol: 'file:',
    slashes: true
  })
  )

  mainWindow.once('ready-to-show', () => {
    if (file) openFile(mainWindow, file)
    mainWindow.show()
  })
  return mainWindow
}

const saveGroceryList = (list) => {
  if (!list) { return }
  writeList(readList(), list)
}


const saveRecipe = (data) => {
  if (!data) {return }
  writeRecipe(readRecipe(), data)
}

const readList = () => {
  return JSON.parse(fs.readFileSync('grocery-list.json'))
}

const readRecipe = () => {
  return JSON.parse(fs.readFileSync('recipes.json'))
}

const writeList = (lists, newList) => {
  lists.grocery_list.push(newList)
  fs.writeFileSync('grocery-list.json', JSON.stringify(lists, null, 2))
}

const writeRecipe = (recipes, newRecipe) => {
  let sameRecipe = false
  let checkRecipe = recipes.all_recipes.map((link) => {
    if(Object.keys(link)[0] === Object.keys(newRecipe)[0]) {
      sameRecipe = true
      return recipes
    } else {
      return link
    }
  })
  recipes.all_recipes = checkRecipe
  if(!sameRecipe) recipes.all_recipes.push(newRecipe)
  fs.writeFileSync('recipes.json', JSON.stringify(recipes, null, 2))
}

// Listen for load message from renderer process
ipcMain.on('load', (event, arg) => {
  if (arg !== null) return
  else {
  //  Reply on load message from renderer process
    event.sender.send('load', fs.readFileSync('recipes.json'));
    event.sender.send('load', fs.readFileSync('grocery-list.json'))
  }
})

ipcMain.on('currentRecipe', (event, data) => {
  saveRecipe(data)
})

ipcMain.on('currentItem', (event, data) => {
  saveGroceryList(data)
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

exports.saveFile = saveFile
