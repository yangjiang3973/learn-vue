# general flow?

in mian.js, init ViewModel

ViewModel defines public methods($set/$get/\$watch...) and `new Compiler(this, options)`

a lot of logic is in compiler.js, this file is very important!

(v0.10 does not split watch logic to watcher.js)

until v0.11, vue split into vue.js, watcher.js, compile.js and observer.js

vue 0.10 用的似乎是事件驱动的更新，并不是订阅依赖。

# 0.11

1. vue.js 里通过`extend`给原型对象 p 添加了一些方法，比如 init，scope 等等，都在 vue instance 里可以 access，但是没有再 constructor 全部 run 一遍。

Vue constructor 里只需要 call `this._init(options)`，然后`_init` 会 call 其他添加的方法，比如 `_initScope`, `_initEvents` 等等.

这些属于内部用的 instance methods.

2. scope 里定义了实例的 observed data，computed properties， user methods， meta properties

先跟着 observed data 这条线走

3. 关于 extend 方法，就是把 A 对象的内容复制给 B

```js
exports.extend = function (to, from) {
    for (var key in from) {
        to[key] = from[key];
    }
    return to;
};
```

## 2020-10-12

vue.js -> instance/init.js -> instance/scope.js -> observer/index.js

TODO: 到了 observer 这里了
