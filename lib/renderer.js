require('./timer')
const $ = require('jquery')
const { ipcRenderer, remote } = require('electron')

const currentWindow = remote.getCurrentWindow()
const { createGroceryList, createMainWindow, saveFile } = remote.require('./main')

$('#save-recipe-btn').on('click', () => {
  $('.error').remove()
  const title = $('#title-field').val()
  const link = $('#url-field').val()
  if (valueCheck(title, link)) return
  const newLink = validateUrl(link)
  showRecipe(title, newLink)
  sendRecipes(title, newLink)
})

$('#save-item-btn').on('click', () => {
  const item = $('#item-input').val()
  const quantity = $('#item-qty-input').val()
  showItem(item, quantity)
  sendItem(item, quantity)
})

const valueCheck = (title, link) => {
  if (title === '' || link === '') {
    $('#recipe-box').prepend('<p class="error">Add a title and a link</p>')
    return true
  }
}

const showRecipe = (title, link) => {
  $('#recipe-box').append(`
    <button class="recipe-title">${title}</button>
    <webview id="${title}" class="hide" src="${link}"></webview>
  `)
}

const showItem = (item, quantity) => {
  $('#grocery-list').append(
    `<p class="grocery-item">Item: ${item}, Quantity: ${quantity}</p>`)
}

const validateUrl = (link) => {
  const urlRegex = /^(http|https)?:\/\/[w]{2,4}[a-zA-Z0-9-\.]+\.[a-z]{1,10}/
  if(!urlRegex.test(link)){
    link = 'https://' + link
  }
  return link
}

ipcRenderer.send('load', null);

ipcRenderer.on('load', (event, arg) => {
  if (JSON.parse(arg).all_recipes) {
    renderRecipes(arg)
  }
  if (JSON.parse(arg).grocery_list) {
    renderGroceryList(arg)
  }
})

const renderRecipes = (recipes) => {
  JSON.parse(recipes).all_recipes.map(recipe => $('#recipe-box').append(`
    <button class="recipe-title">${recipe.title}</button>
    <webview id="${recipe.title}" class="hide" src="${recipe.link}"></webview>
  `))
}

const renderGroceryList = (groceries) => {
  JSON.parse(groceries).grocery_list.map(grocery => {
    $('#grocery-list').append(`<p><b>Item: </b> <i>${grocery.item}</i>, <b>Quantity: </b> <i>${grocery.quantity}</i></p>`)
  })
}

const sendRecipes = (title, newLink) => {
  ipcRenderer.send('currentRecipe', {
      'title': title,
      'link': newLink
  })
}

const sendItem = (item, quantity) => {
  ipcRenderer.send('currentItem', {
    'item': item,
    'quantity': quantity
  })
}


$('#grocery-list-btn').on('click', (e) => {
  createGroceryList()
  createMainWindow()
})

$('#recipe-box').on('click', 'button', (e) => {
  const target = $(e.target)
  if (!target.next('webview').hasClass('hide')) {
    target.next('webview').addClass('hide')
  } else {
    target.next('webview').removeClass('hide')
  }
})

$('#save-list-btn').on('click', () => {
  let text = $('#grocery-list').text()
  console.log(text);
  saveFile(text);
})
