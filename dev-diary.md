# 2020-09-22

1. (DONE) 了解 MVVM，实现数据的双向绑定。

# 2020-09-25

1. (DONE) 实现 observer 之外的 watcher 和 compiler

可能是最终要实现的目标（怎么用）有点模糊，用 vue 写个简单的例子，看看要实现的双向绑定的最终效果。

顺便可以当做测试例子。

# 2020-09-25

1. (DONE) 初始化视图，先不进行更新功能

2. (DONE) stop at compiler.js line#90

# 2020-09-27

1. (DONE) Data Proxy

2. (DONE) update view after data changed

3. (DONE) update data when input's content changes(`v-model`)

4. (DONE) Event listener(`v-on:click`)

# 2020-09-28

1. 实现 vue 0.11 的功能？先看看 vue 0.11 版本的情况，了解下！

2. async batch updates？

3. unit test? Karma, jest? Karma first. Learn it!

# 2020-09-30

1. read sorce code of vue 0.10

# 2020-10-12

1. (IN PROGRESS) setup unit test

so I need to learn karma + jasmine first

karma 是一个可以在多个浏览器中执行 js 代码的简单工具。它不是一个完整的测试框架，没有断言库，只是启动了一个 http 服务器，然后生成测试 html 文件，执行测试用例的 js。

karma 需要配合断言库使用，比如 jasmine 或者 mocha

(DONE) 1.1 ignore vue's test and write a small demo to run karma and jasmine successfully.

2. read source code of vue 0.11 and implement features in my repo

# 2020-10-13

1. need to understand `$add/$delete` methods, in order to learn source code better

2. Q: `require('./object');` without assigning to any variable?? no export in file `object`?

Ans: `A` require file `B` means to add B to A directly. Since in file B, functions get called immediately,

so when running A, B's functions will also run.

# 2020-10-14

1. 为什么需要$set, $delete 等等？

因为 getter 和 setter 存在的缺陷：只能监听到属性的更改，不能监听到属性的删除与添加。

2. transclude 的意思是内嵌，这个步骤会把你 template 里给出的模板转换成一段 dom，然后抽取出你 el 选项指定的 dom 里的内容，把这段模板 dom 嵌入到 el 里面去

3. 如何打断点来看 vue 的代码呢？找找教程或者工具？学习下，很有用！

# 2020-10-15

1. 想打断点看看最简单的`v-text`命令是怎么走完整个流程的。

    1.1. (DONE) 可以 debug 打包后的 vue.js

    1.2 (DONE) 分源文件进行 debug，更好的看清文件之间的跳转和关系? 这个版本的打包有 source map 之类的吗？

    (DONE): 新思路，在 learn-vue 这个 repo 先用 webpack 进行打包，放到 devserver，然后把 debugger 变成 attach 而不是 launch？
    （不用 attach）

2. compile 是个很大的模块，仔细研究下 compile！分析下关键节点，看看该位置的变量内容，比如 directive

    把 compile 的流程理出来！

# 2020-10-16

1. (DONE) setup webpack and vscode debugger in original vue repo to debug source code

2. (DONE) use a simle `v-text` node to see how compile work?

# 2020-10-17

1. Q: why use so many closures when compile to links?

2. (DONE) in compile, still use 3 stages but not use closures to create link for more directives and other features.

so maybe can understand why vue uses this way.

3. TODO: start writing more directives and refactor previous code(especially compile part)

    3.1 v-text (DONE)
    3.2 v-model (DONE)
    3.3 on:click (DONE) NOTE: 0.11 syntax is differnt `v-on='click: '`, changed on 1.0. but I followed 1.0's syntax
    3.4 v-if(DONE)
    3.5 v-repeat() NOTE: first, follow 0.11 implement basic `v-repeat`, then change it to `v-for`
    3.6 {{ }} for v-text (DONE)
    3.7 v-show(DONE)
    3.8 v-bind() NOTE: 0.11 does not have v-bind, until 1.0 this directive is added

# 2020-10-20

1. (DONE) finished the main logic structure and make `v-text` work

2. TODO: add unit tests like vue for implemented directives and functions

# 2020-10-26

1. looks like `v-if` use `<!--v-if-start-->` and `<!--v-if-end-->` as anchor to locate v-if block(control append and remove)

# 2020-10-28

1. need to learn RegExp in js because in vue, it use RegExp to parse text

# 2020-10-29

1. 暂时`v-repeat`先不写？太复杂了。可以先干别的，然后到了 1.0 版本的时候直接写`v-for`

2. 除很复杂的 directive，大部分 directive 进行了简单的实现。接下来换个主题：`filters`

3. (DONE) filters: 2.0 版本移除了 filters。 我就写了几个简单的 filters：uppercase, lowercase, capitalize
   (from 2.0: `总之，能在原生 js 中实现的东西，我们尽量避免引入一个新的符号去重复处理同样的问题`)
   研究 2.0 版本的时候再仔细看看`迁移`相关的文档。

4. TODO: AST 到底是什么？

# 2020-10-30

1. `Mustache Bindings` for attr is changed in v2.0? or 1.0?

try in 2.0 first (2.0 does not have Mustach Bindings)

2. (DONE) implement `computed`

# 2020-11-01

1. (DONE) implement `Custom Directives`(TODO: right without args, need to complement)

# 2020-11-02

1. `static` method or variable is not shared by instances..is it a feature that only js has?? what about java

    need to learn more ablout js's class and static

2. (DONE) implement `Custom Filters`

3. (DONE) implement `Transitions` (Basic css transition with setTimeout, need to learn techniques about frame flush)

    3.1 learn how to use transition first(DONE)

    3.2 compare it with pure css way to achieve the same effect(DONE)

    3.3 read the source code(DONE)

4. (TODO) need to set priority(high priority will execute first, for example, `transition` has hight priority than `if`)

# 2020-11-04

1. (DONE) implement `component`

    5.1 learn how to use component first(DONE)
    5.2

2. (DONE) implement template parser

# 2020-11-06

1. come back to `v-repeat`？ no, `v-repeat` syntax is so bad at v0.11

2. the frame of code is done, then adding unit test to do TDD for improvement

# 2020-11-08

1. (TODO) Add unit test

2. (TODO) Batch updates

`value changes are batched within an event loop. This means when a value changes multiple times within a single event loop, the callback will be fired only once with the latest value.`

batcher keeps a queue which contains instances of watchers

3. (DONE) review relationships between watcher and dep for `compouted`

    while I am writing unit test of observer, I found I fotgot the details

    `每个data的key对应一个dep，像一个computed fullName， 可能依赖俩dep（firstName， lastName），这俩的subs里有共同的watcher`

# 2020-11-09

1.  (DONE) implement `$add/$set/$delete`
    1.1 `$add`(DONE)

    1.2 `$set`(DONE)

    1.3 `$delete`(DONE)

    NOTE: although I implement these 3 api, but I still do not know where should I use them? what kind of cases!

2.  (TODO) refactor the path parser(use in watcher getter to re-organize key path)

    Parse a string path into an array of segments(`a[b.c]` is different from `a.b.c`)

3.  (TODO) how to debug in unit test with jasmine

# 2020-11-10

1. (DONE) refactor observer for `Array`

    1. (DONE)the first level is data, which is obj, I do not find it is necessary to check if the first level is array.

        otherwise need to check type when create observer instance, like vue use `create()`

        I was wrong, `new Observer(obj)` is not only use for `this._data`. When adding new data, may also need to observe.

        so I need to fix the first level problem in `aue.js`, by createing a function like create() to check the parameter type

    (DONE) I think go through of vue's observer will help me have a clear idea about fixing this problem

    NOTE: maybe read the logic in `Observer.create()` again

2. BUG: `v-text='objArr[0]'` does not work. `v-text` has problem on array keypath

    FIXED: still a temp solution, need to refactor to a official way to parse keypath

3. Why are there another `$set` for array, why not use the existing one?

    (DONE)Because obj's \$set only change array element by index, so no notify action.

    For array, it is better to sue fake method: `splice` to update element.

    array's `$set` is to wrap `splice`

    (DONE)Q: what is the relationships between array proto and obj proto.

    Array proto points to obj proto

4. observer for Array is almost done, except No.1 todo request. I also added unit tests for observer

# 2020-11-11

1. (TODO) implement `nextTick()`

    1. need to understand what `nextTick()` does. It is in `util/env.js`

        MutationObserver

    2. need to understand browser's event loop and task + microtask

        eventloop and rAF

        UI render(Async) and dom operations(Sync)

    3.

2. (TODO) refactor `watcher`
