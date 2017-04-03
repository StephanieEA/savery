require('./timer')
const $ = require('jquery')
const { ipcRenderer, remote } = require('electron')

const currentWindow = remote.getCurrentWindow()
const { createGroceryList, createMainWindow } = remote.require('./main')
const recipes = []

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
  if (!target.next('webview').hasClass('hide')) {
    target.next('webview').addClass('hide')
  } else {
    target.next('webview').removeClass('hide')
  }
})

$('input').click(() => {
  $('#delete').toggle(this.checked)
})

$('#update-btn').on('click', (e) => {
  $('.delete input:checked').closest('div').remove()
})

const renderRecipes = (recipes) => {
  JSON.parse(recipes).all_recipes.map(recipe => $('#recipe-box').append(`
    <div id=${recipe.title}>
      <button class="recipe-title">${recipe.title}</button>
      <label class="delete" for=${recipe.title}><input type="checkbox" id=${recipe.title}> delete</label>
      <webview id="${recipe.title}" class="hide" src="${recipe.link}"></webview>
    </div>
    `))
  }

const valueCheck = (title, link) => {
  if (title === '' || link === '') {
    $('#recipe-box').prepend('<p class="error">Add a title and a link</p>')
    return true
  }
}

const showRecipe = (title, link) => {
  $('#recipe-box').append(`
    <div id=${title}>
      <button class="recipe-title">${title}</button>
      <input type="checkbox"><label class="delete" for="delete"> delete</label>
      <webview id="${title}" class="hide" src="${link}"></webview>
    </div>
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

const renderGroceryList = (groceries) => {
  JSON.parse(groceries).grocery_list.map(grocery => {
    $('#grocery-list').append(`<p>Item: ${grocery.item}, Quantity: ${grocery.quantity}`)
  })
}

const sendRecipes = (title, newLink) => {
  ipcRenderer.send('currentRecipe', {
      'id': Date.now(),
      'title': title,
      'link': newLink
  })
}

// const deleteRecipes = () => {
//   let checkboxes = $('#recipe-box').find('input')
//   let buttons = $('#recipe-box').find('button')
//   for (let i=0; i<checkboxes.length; i++) {
//     if(checkboxes[i].id === buttons.id){
//       buttons[i].slice(checkboxes)
//     }
//     return checkboxes;
//   }
// }

ipcRenderer.send('load', null);

ipcRenderer.on('load', (event, arg) => {
  if (JSON.parse(arg).all_recipes) {
    renderRecipes(arg)
  }
  if (JSON.parse(arg).grocery_list) {
    renderGroceryList(arg)
  }
})
