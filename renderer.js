// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const $ = require('jquery');
const moment = require('moment');
const {ipcRenderer} = require('electron');


$('#save-recipe-btn').on('click', () => {
  const title = $('#title-field').val();
  const link = $('#url-field').val();
  const newLink = validateUrl(link);
  saveRecipe(title, newLink);
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
  return link;
}

// Helper function, to format the time
const secondsToTime = (s) => {
  let momentTime = moment.duration(s, 'seconds');
  let sec = momentTime.seconds() < 10 ? ('0' + momentTime.seconds()) : momentTime.seconds();
  let min = momentTime.minutes() < 10 ? ('0' + momentTime.minutes()) : momentTime.minutes();
  return `${min}:${sec}`;
}

ipcRenderer.on('timer-change', (event, t) => {
  // Initialize time with value sent with event
  let currentTime = t;

  // Print out the time
  timerDiv.innerHTML = secondsToTime(currentTime);

  // Execute every second
  let timer = setInterval(() => {
    // Remove one second
    currentTime = currentTime - 1;
    // Print out the time
    timerDiv.innerHTML = secondsToTime(currentTime);
    // When reaching 0. Stop.
    if(currentTime <= 0) {
      clearInterval(timer);
    }
  }, 1000); // 1 second
})
