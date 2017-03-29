const electron = require('electron')
const $ = require('jquery');

const ipc = electron.ipcRenderer
const remote = electron.remote
const shell = electron.shell

const currentWindow = remote.getCurrentWindow()

const { createGroceryList } = remote.require('./main')

$('#save-recipe-btn').on('click', () => {
  const title = $('#title-field').val()
  const link = $('#url-field').val()
  const newLink = validateUrl(link)
  saveRecipe(title, newLink)
})

const saveRecipe = (title, link) => {

  $('#recipe-box').append(`<li>
    <h2>${title}</h2>
    <a href="${link}">link</a>
  </li>`)
}

const validateUrl = (link) => {
  const urlRegex = /^(http|https)?:\/\/[w]{2,4}[a-zA-Z0-9-\.]+\.[a-z]{1,10}/
  if(!urlRegex.test(link)){
    link = 'https://' + link
  }
  return link
}

const sendUrl = () => {
  ipc.send()
}

$('#grocery-list-btn').on('click', (e) => {
  createGroceryList()
})
