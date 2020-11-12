1. event loop(introduction): https://www.youtube.com/watch?v=8aGhZQkoFbQ

2. (need to watch again slowly)task and micro tasks(deeper): https://www.youtube.com/watch?v=cCOL7MC4Pl0

3. HTML5 standard of event loop processing model: https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model

# Event loop and UI rendering

Rendering never happens while the engine executes a task.

It doesn’t matter if the task takes a long time.

changes to DOM are painted only after the currently running task is completed

```javascript
<div id="progress"></div>

<script>

  function count() {
    for (let i = 0; i < 1e6; i++) {
      i++;
      progress.innerHTML = i;
    }
  }

  count();
</script>
```

A lot of DOM changes in a task(script) will not show `intermediate` state, because UI render will only happen when it is completed.

If need to show changes in the middle of counting, need to use `setTimeout` to split it into multiple pieces(more small tasks).

So UI rendering can happen in between.

# Microtask

Microtasks come solely from our code. They are usually created by promises.

Also, Microtasks are used “under the cover” of await as well, as it’s another form of promise handling.

```cs
Immediately after every macrotask,

the engine executes all tasks from microtask queue, prior to running any other macrotasks or rendering or anything else.
```

That’s important, as it guarantees that the application environment is basically the same

(no mouse coordinate changes, no new network data, etc) between microtasks.

# Web Workers

For long heavy calculations that shouldn’t block the event loop, we can use Web Workers.

That’s a way to run code in another, parallel thread.

Web Workers can exchange messages with the main process, but they have their own variables, and their own event loop.

Web Workers do not have access to DOM, so they are useful, mainly, for calculations, to use multiple CPU cores simultaneously.
