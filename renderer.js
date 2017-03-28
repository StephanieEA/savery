// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const $ = require('jquery');

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
