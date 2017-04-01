const $ = require('jquery')
const { ipcRenderer, remote } = require('electron')

const currentWindow = remote.getCurrentWindow()
const { createGroceryList } = remote.require('./main')
const { secondsToTime, resetTimer } = require('./timer')

$('#save-recipe-btn').on('click', () => {
  const title = $('#title-field').val()
  const link = $('#url-field').val()
  const newLink = validateUrl(link)
  showRecipe(title, newLink)
  sendRecipes(title, newLink)
})

const showRecipe = (title, link) => {
  $('#recipe-box').append(`
    <h2><a href="${link}">${title}</a></h2>
  `)
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
  // Send base Recipe back on sync
  ipcRenderer.send('load', arg);

   renderRecipes(arg)
});

const renderRecipes = (recipes) => {
  JSON.parse(recipes).all_recipes.map(recipe => $('#recipe-box').append(`<h2><a href="${recipe.link}">${recipe.title}</a></h2>`))
}

const sendRecipes = (title, newLink) => {
  ipcRenderer.send('currentRecipe', {
      'title': title,
      'link': newLink
  })
}

$('#grocery-list-btn').on('click', (e) => {
  createGroceryList()
})
