/**
 * @file
 * Turn a file upload form widget into a place you can directly record audio.
 */

console.log('The audio.js script has loaded.');

var fileInputs = document.querySelectorAll('input[type="file"]');

Array.prototype.forEach.call(fileInputs, (elem) => {
  elem.setAttribute('capture', '');
  elem.insertAdjacentElement("beforeBegin", `
    <audio id="${elem.name}-player" controls></audio>
  `);
  elem.addEventListener('change', function(e) {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    e.target.nextElementSibling.src = url;
  });
});
