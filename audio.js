/**
 * @file
 * Turn a file upload form widget into a place you can directly record audio.
 */

'use strict';

/* globals MediaRecorder */

let mediaRecorder;
let recordedBlobs;
let counter;
let counterSeconds = 0;
var gotUserMedia = false;
const recordLabel = '🟢 Record new';
const newStop = '🟥 Stop';

var fileInputs = document.querySelectorAll('input[type="file"]');
var currentElem = fileInputs[0];
Array.prototype.forEach.call(fileInputs, (elem) => {
  // Add native capture attributes.
  elem.setAttribute('capture', '');
  elem.setAttribute('accept', 'audio/*');

  // Add a player to interact with the uploaded/captured audio.
  elem.insertAdjacentHTML('beforebegin', `
    <fieldset class="recorder--container">
      <legend>Recorder/Player (Optional)</legend>
      <small>
        Press the "Record new" button to start a recording. Press the button again 
        to stop. The recording will enter the "Choose File" field automatically 
        when you're done, but you can press "Record new" again to replace it.
      </small>
      <button type="button" id="${elem.name}-record" 
        class="recordAudio">${recordLabel}</button>
      <audio id="${elem.name}-player" controls></audio>
    </fieldset>
  `);
  elem.addEventListener('change', function(e) {
    const file = e.target.files[0];
    const url = URL.createObjectURL(file);
    document.querySelector('#' + e.target.name + '-player').src = url;
  });
});

/**
 * Stream handler, for a much more built-out recording app.
 */
var handleDataAvailable = function(event) {
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
}

/**
 * If getUserMedia is successful, indicate so so we can proceed.
 */
var handleSuccess = function(stream) {
  gotUserMedia = true;
  window.stream = stream;
};

/**
 * Add leading zeroes to time values if they're a single digit.
 */
var timePad = function(val) {
  var valString = val + "";
  return (valString.length < 2) ? "0" + valString : valString;
}

/**
 * Begin a MediaRecorder recording.
 */
async function startRecording(elem) {
  // Prompt user to give microphone permissions.
  if (!gotUserMedia) {
    elem.innerText = 'Authorize microphone';
    const stream = await navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: false
      })
      .then(handleSuccess);
  }

  // Begin recording stream to blobs.
  elem.innerText = newStop + ' (00:00)';
  mediaRecorder = new MediaRecorder(window.stream, {
    mimeType: 'audio/webm'
  });
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.onstop = (event) => {
    var recordingFile = new File(recordedBlobs, 'recording-' + Date.now() + '.webm', {
      type: "audio/webm"
    });

    // Sneak the file into the input.
    var dataTransfer = new DataTransfer();
    dataTransfer.items.add(recordingFile);
    currentElem.files = dataTransfer.files;
    currentElem.dispatchEvent(new Event('change'));
  };
  mediaRecorder.start();

  // Improve button UX with a count-up timer.
  counterSeconds = 0;
  counter = setInterval(function(elem){
    counterSeconds++;
    var out = '';

    // Format the number of seconds into common mm:ss format.
    out = timePad(parseInt(counterSeconds/60)) + ':' + timePad(counterSeconds%60);

    elem.innerText = newStop + ' (' + out + ')';
  }, 1000, elem);
}

/* Use event delegation for any dynamically-added events. */
document.addEventListener(
  "click",
  function (event) {
    if (event.target !== document && event.target.closest(".recordAudio")) {
      let elem = event.target.closest(".recordAudio");
      const fileName = elem.id.substring(0, elem.id.length - 7);
      let file = document.querySelector('input[name="' + fileName + '"]');
      currentElem = file; // Allow us to call this more globally.

      // Button is stateful. First do ops based on state.
      if (elem.innerText === recordLabel) {
        recordedBlobs = [];
        startRecording(elem);
      }
      else {
        clearInterval(counter);
        elem.innerText = recordLabel;

        if (mediaRecorder) {
          mediaRecorder.stop();
        }
      }
    }
  },
  false
);
