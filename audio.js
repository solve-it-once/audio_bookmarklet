/**
 * @file
 * Turn a file upload form widget into a place you can directly record audio.
 */

console.log('The audio.js script has loaded.');

var fileInputs = document.querySelectorAll('input[type="file"]');

Array.prototype.forEach.call(fileInputs, (elem) => {
  elem.setAttribute('capture', '');
  elem.insertAdjacentHTML('afterend', `
    <audio id="${elem.name}-player" controls></audio>
    <button type="button" id="${elem.name}-record" class="recordAudio">Record audio</button>
  `);
  elem.addEventListener('change', function(e) {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    e.target.nextElementSibling.src = url;
  });
});

/* Use event delegation for any dynamically-added events. */
document.addEventListener(
  "click",
  function (event) {
    if (event.target !== document && event.target.closest(".recordAudio")) {
      let elem = event.target.closest(".recordAudio");
      const fileName = elem.id.substring(0, elem.id.length - 7);
      let file = document.querySelector('input[name="' + fileName + '"]');
      let player = file.nextElementSibling;

      const handleSuccess = function(stream) {
        if (window.URL) {
          player.srcObject = stream;
        }
        else {
          player.src = stream;
        }
      };

      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: false
        })
        .then(handleSuccess);
    }
  },
  false
);