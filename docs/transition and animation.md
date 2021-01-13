Use pure javascript and css transition to implement a demo

```html
<div id="demo">
    <button id="btn">Toggle</button>
</div>
```

```css
.content {
    background-color: red;
    opacity: 0;
    transition: opacity 2s;
}

.content.is-visible {
    opacity: 1;
}
```

```js
let parent = document.getElementById('demo');
let btn = document.getElementById('btn');

let content = document.createElement('div');
content.textContent = 'this is the content';
content.className = 'content';

function mount() {
    parent.appendChild(content);
}

function unMount() {
    parent.removeChild(content);
}

function toShow() {
    content.classList.add('is-visible');
}

function toHide() {
    content.classList.remove('is-visible');
}

function toggle() {
    if (!content.isConnected) {
        mount();
        setTimeout(toShow, 100);
    }

    //   content.classList.toggle('is-visible');
    else {
        toHide();
        setTimeout(unMount, 2000);
    }
}

btn.addEventListener('click', toggle);
```
