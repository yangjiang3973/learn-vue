Issue 2873: https://github.com/vuejs/vue/issues/2873(2.0 changes)

1. split runtime and compiler

from npm, just get runtion since consumers will likely pre-compile template with build tool

```
The compiler (the part which converts a template string to a render function) and the runtime can now be separated.

There will be two different builds:

Standalone build: includes both the compiler and the runtime. This functions basically exactly the same Vue 1.x does.

Runtime only build: since it doesn't include the compiler, you need to either pre-compiled templates in a compile step, or manually written render functions. The npm package will export this build by default, since when consuming Vue from npm, you will likely be using a compilation step (with Browserify or Webpack), during which vueify or vue-loader will perform the template pre-compilation.
```

2. Directive interface change

In general, in 2.0 directives have a greatly reduced scope of responsibility:

they are now only used for applying low-level direct DOM manipulations.

In most cases, you should prefer using Components as the main code-reuse abstraction.

**Directives no longer have instances** - this means there's no more this inside directive hooks and bind, update and unbind now receives everything as arguments.

Note the binding object is immutable, setting binding.value will have no effect, and properties added to it will not be persisted.

You can persist directive state on el if you absolutely need to:

`<div v-example:arg.modifier="a.b"></div>`

3. Filter Usage and Syntax Change

    1. Filters can now only be used inside text interpolations (`{{}}` tags)

    2. Vue 2.0 will not ship with any built-in filters.

4. Interpolation inside attributes are deprecated:

```html
<!-- 1.x -->
<div id="{{ id }}"></div>

<!-- 2.0 -->
<div :id="id"></div>
```

5. defects from 1.0's DOM compilation:

```html
<table>
    <my-component></my-component>
</table>
```

1.0 cannot make it work because the limitation from <table>

6. render function:

```js
let vm = new Vue({
    el: '#app',
    data: {
        msg: 'hello',
    },
    render() {
        const h = this.$createElement;
        return h(
            'div',
            {
                attrs: {
                    id: 'test',
                },
            },
            [this.msg]
        );
    },
});
```
