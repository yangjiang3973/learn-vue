TODO: try it in transition.md

`requestAnimationFrame(callback)`

```js
// the code is called on the next available screen repaint,
// typically around 16.7 milliseconds based on a typical screen refresh rate of 60fps.
var adiv = document.getElementById('mydiv');
var leftpos = 0;
requestAnimationFrame(function (timestamp) {
    leftpos += 5;
    adiv.style.left = leftpos + 'px';
});
```

Most of time need to call it `recursively`.

```js
var adiv = document.getElementById('mydiv');
var leftpos = 0;
function movediv(timestamp) {
    leftpos += 5;
    adiv.style.left = leftpos + 'px';
    requestAnimationFrame(movediv); // call requestAnimationFrame again to animate next frame
}
requestAnimationFrame(movediv); // call requestAnimationFrame and pass into it animation function
```
