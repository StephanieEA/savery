// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const $ = require('jquery');

$('#save-recipe-btn').on('click', () => {
  const title = $('#title-field').val();
  const link = $('#url-field').val();
  saveRecipe(title, link);
})

const saveRecipe = (title, link) => {
  $('#recipe-box').append(title)
}
