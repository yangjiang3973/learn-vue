# Vue.createApp

In vue3, it uses `Vue.createApp` to create an application instance.

then call instance's mount method to mount into dom tree

```js
import { createApp } from 'vue';

const app = createApp({});
// do some necessary preparations
app.mount('#my-app');
```

# composition api

# teleports

# Plugins

maybe move transition to a seperate plugin

# ref

```js
import { ref } from 'vue';

const count = ref(0);
```

ref will return a reactive and mutable object that serves as a reactive reference to the internal value it is holding.

that's where the name comes from. This object contains the only one property named value:

Of course, we could make an object with a single property equal to our string, and pass it to reactive
