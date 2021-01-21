# rAF

The window.requestAnimationFrame() method tells the browser that you wish to perform an animation

and requests that the browser calls a specified function to update an animation **before** the next repaint.

The method takes a callback as an argument to be invoked before the repaint.

```js
box.style.transform = 'translateX(1000px)';
requestAnimationFrame(() => {
    box.style.tranition = 'transform 1s ease';
    box.style.transform = 'translateX(500px)';
});
```

这个例子是无效的，因为 rAF 还是在下一帧之前执行，所以等同于：

```js
box.style.transform = 'translateX(1000px)';
box.style.tranition = 'transform 1s ease';
box.style.transform = 'translateX(500px)';
```

要想实现变化，要让 rAF 的内容在下一帧之后，下下帧之前：

```js
box.style.transform = 'translateX(1000px)';
requestAnimationFrame(() => {
    requestAnimationFrame(() => {
        box.style.tranition = 'transform 1s ease';
        box.style.transform = 'translateX(500px)';
    });
});
```

但是这种嵌套的写法太奇葩了，可以直接打断合并：

```js
box.style.transform = 'translateX(1000px)';
box.offsetWidth; // 只要获取一下和排版相关的计算样式即可
box.style.tranition = 'transform 1s ease';
box.style.transform = 'translateX(500px)';
```

`Vue` 的做法是，用嵌套，但是包进一个 function 里，叫 nextFrame。

## A bad way to use pure javascript and css transition to implement a demo

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

## A good way

```js
let parent = document.getElementById('demo');
let btn = document.getElementById('btn');

let content = document.createElement('div');
content.textContent = 'this is the content';

function mount() {
    parent.appendChild(content);
    content.classList.add('box', 'faded-out');
}
function toggle() {
    if (!content.isConnected) {
        mount();
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                // second state
                content.classList.remove('faded-out');
            });
        });
    } else {
        content.classList.add('faded-out');
        // then to remove
        const timeOut = getTransitionInfo(content);
        setTimeout(() => {
            parent.removeChild(content);
        }, timeOut);
    }
}

function getTransitionInfo(el) {
    const styles = window.getComputedStyle(el);
    const transitioneDelays = styles['transitionDelay'].split(', ');
    const transitionDurations = styles['transitionDuration'].split(', ');
    const transitionTimeout = getTimeout(
        transitioneDelays,
        transitionDurations
    );
    return transitionTimeout;
}

function getTimeout(delays, durations) {
    return Math.max.apply(
        null,
        durations.map((d, i) => {
            return toMs(d) + toMs(delays[i]);
        })
    );
}

function toMs(s) {
    return Number(s.slice(0, -1)) * 1000;
}

btn.addEventListener('click', toggle);
```
