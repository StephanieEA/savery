const $ = require('jquery')
const moment = require('moment')
const { ipcRenderer, remote } = require('electron')

const currentWindow = remote.getCurrentWindow()

$('#save-recipe-btn').on('click', () => {
  const title = $('#title-field').val()
  const link = $('#url-field').val()
  const newLink = validateUrl(link)
  showRecipe(title, newLink)
  sendRecipes(title, newLink)
})

const showRecipe = (title, link) => {
  $('#recipe-box').append(`
    <button class="recipe-title">${title}</button>
    <webview id="${title}" class="hide" src="${link}"></webview>
  `)
}

const validateUrl = (link) => {
  const urlRegex = /^(http|https)?:\/\/[w]{2,4}[a-zA-Z0-9-\.]+\.[a-z]{1,10}/
  if(!urlRegex.test(link)){
    link = 'https://' + link
  }
  return link
}

// Send async message to main process
ipcRenderer.send('load', null);

// Listen for load-reply message from main process
ipcRenderer.on('load', (event, arg) => {
  // Send base Recipe back on sync
  ipcRenderer.send('load', arg);

   renderRecipes(arg)
});

const renderRecipes = (recipes) => {
  JSON.parse(recipes).all_recipes.map(recipe => $('#recipe-box').append(`
    <button class="recipe-title">${recipe.title}</button>
    <webview id="${recipe.title}" class="hide" src="${recipe.link}"></webview>
  `))
}

const sendRecipes = (title, newLink) => {
  ipcRenderer.send('currentRecipe', {
      'title': title,
      'link': newLink
  })
}

// Helper function, to format the time
const secondsToTime = (s) => {
  const momentTime = moment.duration(s, 'seconds');
  const sec = momentTime.seconds() < 10 ? ('0' + momentTime.seconds()) : momentTime.seconds()
  const min = momentTime.minutes() < 10 ? ('0' + momentTime.minutes()) : momentTime.minutes()
  const hours = momentTime.hours() < 10 ? ('0' + momentTime.hours()) : momentTime.hours()
  return `${hours}:${min}:${sec}`
}

// Initialize currentTime
let currentTime = 0

$('#increase-time').on('click', () => {
  currentTime = currentTime + 60
  timerDiv.innerHTML = secondsToTime(currentTime)
})

$('#decrease-time').on('click', () => {
  currentTime = currentTime - 60
  timerDiv.innerHTML = secondsToTime(currentTime)
})

$('#start-timer').on('click', () => {
  setInterval(() => {
    // When reaching 0. Stop.
    if(currentTime <= 0) return
    // Remove one second
    currentTime = currentTime - 1
    // Print out the time
    timerDiv.innerHTML = secondsToTime(currentTime)
  }, 1000) // 1 second
})

$('#recipe-box').on('click', 'button', (e) => {
  const target = $(e.target)

  $('webview').addClass('hide')
  target.next('webview').removeClass('hide')
})
