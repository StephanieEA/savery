const $ = require('jquery')
const moment = require('moment')
const { ipcRenderer, remote } = require('electron')

const currentWindow = remote.getCurrentWindow()
const { createGroceryList } = remote.require('./main')

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

let currentTime = 0
let run = false
let timer = null

const secondsToTime = (s, run) => {
  const momentTime = moment.duration(s, 'seconds');
  const sec = momentTime.seconds() < 10 ? ('0' + momentTime.seconds()) : momentTime.seconds()
  const min = momentTime.minutes() < 10 ? ('0' + momentTime.minutes()) : momentTime.minutes()
  const hours = momentTime.hours() < 10 ? ('0' + momentTime.hours()) : momentTime.hours()
  return `${hours}:${min}:${sec}`
}

const resetTimer = (target) => {
  clearInterval(timer)
  target.text('START')
  run = false
}

$('#increase-time').on('click', () => {
  currentTime = currentTime + 5
  timerDiv.innerHTML = secondsToTime(currentTime)
})

$('#decrease-time').on('click', (e) => {
  if (currentTime - 5 <= 0) return
  currentTime = currentTime - 5
  timerDiv.innerHTML = secondsToTime(currentTime)
})

$('#start-timer').on('click', (e) => {
  const target = $(e.target)
  run = !run
  // allows timer to pause when button is clicked
  if (!run) {
    resetTimer(target)
  } else {
    timer = setInterval(() => {
    // reset Timer once it reaches 0
    if(currentTime <= 0) {
      resetTimer(target)
    } else {
      currentTime = currentTime - 1
      target.text('PAUSE')
    }
    timerDiv.innerHTML = secondsToTime(currentTime)
  }, 1000)
  }
})

$('#grocery-list-btn').on('click', (e) => {
  createGroceryList()
})
