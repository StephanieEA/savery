require('./timer')
const $ = require('jquery')
const { ipcRenderer, remote } = require('electron')

const currentWindow = remote.getCurrentWindow()
const { createGroceryList, createMainWindow } = remote.require('./main')

$('#save-recipe-btn').on('click', () => {
  const title = $('#title-field').val()
  const link = $('#url-field').val()
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

const showRecipe = (title, link) => {
  $('#recipe-box').append(`
    <button class="recipe-title">${title}</button>
    <webview id="${title}" class="hide" src="${link}"></webview>
  `)
}

const showItem = (item, quantity) => {
  $('#grocery-list').append(
    `<li class="grocery-item">Item: ${item}, Quantity: ${quantity}</li>`)
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
   renderRecipes(arg)
   renderGroceryList(arg)
});

const renderRecipes = (recipes) => {
  JSON.parse(recipes).all_recipes.map(recipe => $('#recipe-box').append(`
    <button class="recipe-title">${recipe.title}</button>
    <webview id="${recipe.title}" class="hide" src="${recipe.link}"></webview>
  `))
}

const renderGroceryList = (groceries) => {
  JSON.parse(groceries).all_Groceries.map(grocery => {
    $('#grocery-list').append(`<p>Item: ${grocery.item}, Quantity: ${grocery.quantity}`)
  })
}

const sendRecipes = (title, newLink) => {
  ipcRenderer.send('currentRecipe', {
      'title': title,
      'link': newLink
  })
}

$('#grocery-list-btn').on('click', (e) => {
const sendItem = (item, quantity) => {
  ipcRenderer.send('currentItem', {
    'item': item,
    'quantity': quantity
  })
  }
})

$('#grocery-list-btn').on('click', (e) => {
  createGroceryList()
  createMainWindow()
})

$('#recipe-box').on('click', 'button', (e) => {
  const target = $(e.target)

  $('webview').addClass('hide')
  target.next('webview').removeClass('hide')
})
