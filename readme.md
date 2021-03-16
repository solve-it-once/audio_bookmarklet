# audio_bookmarklet

This bookmarklet inserts a JavaScript (and a little bit of CSS, too) to insert 
a record button and audio player that will interact with a standard HTML
`<input type="file" />` to allow you to record and upload audio recordings 
without leaving the page.

## To use as a bookmarklet

Drag this link to your bookmarks bar.

```
<a href="javascript:(function(){document.body.appendChild(document.createElement('script')).src='https://solveitonce.com/audio_bookmarklet/audio.js';var c=document.createElement('link');c.rel='stylesheet';c.href='https://solveitonce.com/audio_bookmarklet/audio.css';document.body.appendChild(c);})();">File to audio</a>
```

The address to put in the bookmarklet (same as above) on its own is:
```
javascript:(function(){document.body.appendChild(document.createElement('script')).src='https://solveitonce.com/audio_bookmarklet/audio.js';var c=document.createElement('link');c.rel='stylesheet';c.href='https://solveitonce.com/audio_bookmarklet/audio.css';document.body.appendChild(c);})();
```
...since it's unlikely you can directly drag the link.