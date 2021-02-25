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

1.  (TODO) implement `nextTick()`

    1.1 need to understand what `nextTick()` does. It is in `util/env.js`

        `MutationObserver` is to make update run in async way. Maybe also use `Promise`

    1.2 need to understand browser's event loop and task + microtask

        eventloop and rAF

        UI render(Async) and dom operations(Sync)

    1.3 Unit test

By the way, check how much time saved by `batcher update`:

2. (DONE) refactor `watcher`

    2.1 make a getter function to get value based on expression(DONE)

3. (DONE) implement `config`(basic setup)

4. (TODO) implement `$watch`, because in batcher.js, there is `userQueue` (DONE)

    if users use `$watch` to watch data, this kind of watchers will put into `userQueue`,

    because the callback may trigger other watchers.

# 2020-11-13 (milestone)

1. (TODO) make a better `warn()` in util.js

2. (DONE) finished the basic batcher.js

3. NOTE: this is like a milestone, about 1000 line finished the core features of vue 0.11

4. TODO: move to Vue 1.0, check changes in core files first(watcher.js, observer.js ans so on)

    do not just read, but also follow unit test!

5. for parser, find a quick way to copy and use it directly for now. Maybe do research on it later.

# 2020-11-15

1.  (DONE) setup dev server for vue 1.0

2.  (TODO) go through unit test of vue1.0 for finished module to update code

    2.1 batcher(DONE)

    2.2 observer module

        2.2.1 observer.js

            (DONE) first level problem: in unit test, like array observe related, need to solve first level dep(add an observe method to check type before new Observer)
                I think it is better to go through vue's observer logic first and draw a workflow

            (DONE) need to change `this.deps` in Observer. I think only need one dep(not array)

            (TODO) watcher's deps changed in Vue1.0, `obj.a.b;` will create `obj.a + a + a.b` 3 deps
            because in this version's getter

            ```js
            if (childOb) {
            childOb.dep.depend();
            }
            ```

            NOTE: it will add intermedia path to watcher.deps. I do not know why adding this

            (DONE) update`$add/$set/$remove` to `_.set` or `_.delete`. Vue1.0 moved them to util

        2.2.2 dep.js(DONE)

3.  (TODO) config unit test better like vue1.0, setup `index.js` in unit test for global util function and variable

# 2020-11-23

1. read code of vue1.0's observer and understand its logic

then refactor my own observer

2. change `set` and `delete`(DONE)

3. TODO: unit tests for watcher

    3.1 find a hack way to borrow parser code from vue and use it in watcher directly(skip over parser for now)

    3.2 refactor $set and $remove, not just `_.set`

    3.3 implement `$data` (I used a brutal way) (DONE)

    3.4 implement `deep` feature in Watcher and `$watch`(DONE)
    (deep means also watch child data.
    for example, if a watcher is watcher a.b
    if you change a.b.c = 1,
    watcher of b will also update
    )

    3.5 lazy watcher??

    3.6 watcher's active flag??

# 2020-11-26

1. need to learn what lazy watcher is and where it is used? 0.11 does not have lazy watcher

    lazy watcher is used in `computed` feature.

    It is different from normal watchers

    when upgrade computed, then touch deeply with lazy watcher(TODO)

2. add `watch` as options in Vue instance

3. upgrade `filters` and unit test

4. data api's like $watch, $set and so on

5. `v-for`

compile stage is coupled with a lot of directives, like v-for....

should I continue to v2.0 with virtual dom and refactor compile stage?

or continue with more features in v1.0?

start with 2.0 (IN PROGRESS)

6. setup typescript and learn syntax

7. read articles about virtual dom and diff

# 2020-11-27

1. typescript

# 2020-11-29

1. set up typescript in my project(DONE)

2. flow(已经快凉了的既视感, 先集中 ts)

# 2020-11-30

1. to make vue 2.0 able to run and use debugger.

    1.1 webpack
    1.2 flow problem

    maybe start another project to learn how to config these

# 2020-12-01

1. 2 main problems: (DONE)

    1. webpack root dir. Vue 2.0 use absolute path and set root as src(DONE)

        `resolve.modules` 而不是`resolve.roots`.....

        而且有 vue 有 alias.js，用 webpack 的 resolve.alias

    2. flow. I do not want to change the code, just want to webpack accept flow syntax(DONE)

so I start a empty project to learn. then apply to Vue 2.0's repo

2. (DONE) read the article again and write down the questions(http://hcysun.me/2017/03/03/Vue%E6%BA%90%E7%A0%81%E5%AD%A6%E4%B9%A0/)

# 2020-12-02

1. Some notes about 2.0

    split compiler and runtime. From npm, it is just runtime because consumers will likely pre-compile the templates with a build tool.

2. rendering process: parse template -> render(with `_h` as createElement) -> vdom

if I write jsx in vue, and use babel plugin mabey to transpile(convert code to createElement), so I do not need to work with template parser.

instead, I can focus on render function and vdom

TODO: learn how to write JSX in vue and setup with transpile tool

# 2020-12-07

1. (DONE) config jsx and use webpack to make it run in real vue 2.0.0

2. (DONE)introduce the similar settings to my `learn-vue` repo, and start working on virtual dom

3. (DONE) createElement function(also called `h`) to create vdom tree

4. (DONE) render real dom tree from virtual dom

# 2020-12-09

1. (DONE)render attributes from vnode to real node

2. read a blog about virtual dom rendering:

`http://hcysun.me/vue-design/zh/renderer.html#%E8%B4%A3%E4%BB%BB%E9%87%8D%E5%A4%A7%E7%9A%84%E6%B8%B2%E6%9F%93%E5%99%A8`

```js
function render(vnode, container) {
    const prevVNode = container.vnode;
    if (prevVNode == null) {
        if (vnode) {
            // 没有旧的 VNode，只有新的 VNode。使用 `mount` 函数挂载全新的 VNode
            mount(vnode, container);
            // 将新的 VNode 添加到 container.vnode 属性下，这样下一次渲染时旧的 VNode 就存在了
            container.vnode = vnode;
        }
    } else {
        if (vnode) {
            // 有旧的 VNode，也有新的 VNode。则调用 `patch` 函数打补丁
            patch(prevVNode, vnode, container);
            // 更新 container.vnode
            container.vnode = vnode;
        } else {
            // 有旧的 VNode 但是没有新的 VNode，这说明应该移除 DOM，在浏览器中可以使用 removeChild 函数。
            container.removeChild(prevVNode.el);
            container.vnode = null;
        }
    }
}
```

3. (DONE) temp solution for svg and svg children like `<circle/>`

`对于 SVG 标签，更加严谨的方式是使用 document.createElementNS 函数`

4. (DONE) map event from jsx to vnode then to real dom

5. ignore `Fragment` and `portal` for now.

6. start working on basic component

    6.1 old object style component in vue 2.0(DONE)
    6.2 class style(DONE)
    6.3 functional style(need to initialize with vue.component)

# 2020-12-10

1. (DONE)how to differ from class component and functional component: `tag.prototype && tag.prototype.render`

2. `Vue.component('name', {options})`, what is this and any shortcut?
   (shortcut means no need to explicitly call Vue.component to declare a component,
   instead, when create vnode, should detect if it is a component and init it.
   )

3. (DONE) When to trigger patch when data updates

need to read code of watcher and new workflow that removed directive class.

not too many new changes:

    1. use a global watcher in `_mount`:

        ```js
        this._watcher = new Watcher(
            this,
            // pass a fn to watcher. this._render() will run first, then this._update().  this._render() is from file render.js
            // _render() will return a vnode
            () => {
                this._update(this._render());
            },
            () => {}
        );
        ```
    2. when run the arrow fn in watcher, will create dependency

    3. when data change, observer will notify and run watcher's update, which will lead to update the vnode and patch

2. (IN PROGRESS) patch(i.e update the dom tree)

# 2020-12-11

1. patching policy:

    1. compare dom element with component
    2. (DONE) compare dom element A with dom element B(update data)
    3. (DONE) do the above on children node recursively

# 2020-12-12

1. patch text node(the old and the new ones are both text)

2. (DONE)update component driven by state change

# 2020-12-13

1. (DONE) implement props for component

2. (TODO) should systematiclly implement component feature

3. (IN PROGRESS) diff algo

# 2020-12-22

1. right now just use react diff algo, maybe upgrade later.

continue to implement other features, like `component`

2. (TODO) start working on component

3. use vue2.0 to try jsx and component development style

4. why need to register component? what if not?

5. use `<script>` tag in `.vue` file even writing jsx?

if using in this way, then still possible to use scoped css.

# 2020-12-23

1. NOTE: pass props to child component:

if child component defined props and has the pass key, this entry will move from attrs to props

# 2020-12-24

1. Question: if vue2.0 convert template to vnode, how to keep directives(without directive class)?

# 2020-12-25

1.  make the todo App work(including basic events and `component`)

    (DONE) 1.0 convert back to basic syanx without any syntax sugar

    1.1 (DONE)data is a function, need to proxy correctly

    1.2 (IN PROGRESS) Vue.extend() and Vue.component() as global api

        Vue.extend() is to construct a sub class by using the Vue's constructor

        this is the first important step for implementing component feature

    1.3 (DONE) maybe need to refactor the Aue class.

    NOTE:

    ```js
    initMixin(Vue);

    stateMixin(Vue);
    eventsMixin(Vue);
    lifecycleMixin(Vue);
    renderMixin(Vue);
    ```

    initMixin is special but the left has similar structure

    for example, state.js has 2 parts: initState and stateMixin.

    initState is called in initMixin, stateMixin adds methods into Vue.prototype

    so do others.

    initMixin calls all other initXXX in \_init():

    ```js
    initLifecycle(vm);
    initEvents(vm);
    callHook(vm, 'beforeCreate');
    initState(vm);
    callHook(vm, 'created');
    initRender(vm); //* NOTE: call vm.$mount() here!!
    ```

    \_init() is called in constructor of vue, and at that time all methods are already added to Vue.prototype.

# 2020-12-27

1. finish refactoring Aue.js and make it works.(render left: mount)

# 2020-12-28

1. what is the meaning of `assets` in Vue???

```js
/**
 * List of asset types that a component can own.
 */
_assetTypes: [
    'component',
    'directive',
    'filter'
],
```

2. what is `hydrating`?

3. BUG: bug when patch again abc->debc->abc

becaue I bind the function in addEventListener but forgot bind in removeEventListener
(passed two different fns)

I should bind the method in initMethods, not in addEventListener

(TODO) Event listener's update is much complicated than I thought, need to refactor event part!

4. to continue task in #2020-12-25, finish extend and make component works!

# 2020-12-30

1. why not create component instance and call render in place(in create-element.js)?

instead, add init as hooks and call in patch

because it uses the $mount function, which will not return vnode?

or other reason?

ok, now still follow the vue's logic and see the whole workflow for compnent.

2. BUG: circular dependency

why in vue2.0 no issue like this, it seems the import structure is similar....

need to print dependency tree in detail in both repo

Progress 1: seems this is a commonJS feature for circular dependency: return empty object

one solution is to put require at the end, after necessary require: `https://stackoverflow.com/questions/30378226/circular-imports-with-webpack-returning-empty-object`

3. (DONE) maybe this is the time to change from commonJS to ES6

4. FIXED: render function missing in component options

TODO: but still have problem in process options in different stages.

need to re-consider differnt options in instance and component class and Vue(or call it constructor function)

5. TODO: props related features in component:

    1. `normalizeProps`(is called in `mergeOptions`)

    2. proxy prop

    3. make props reactive to changes

# 2020-12-31

1. FIXED: caused by `typeof null === 'object'`...

in Observer, need to use a better way to check child data's type.

maybe reuse 'observeData' function?

TODO: need to re-factor observer a little. For child obj, use observeData again? and run the unit test again after refactor

now just use a dirty fix

2. TODO: refactor unit test(commonJS to es6)

3. FIXED: `this.filteredTodos.map` in JSX will return an array

```jsx
<ul>
    {this.filteredTodos.map((todo) => {
        return <li>aaa</li>;
    })}
</ul>
```

this mean `<ul>[li, li, li]</ul>`(even deeper nested array: `[[],[[],[[]]]]`)

so need to flat!(https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat)

TODO: make a better `normalizeChildren()`

# 2021-01-02

1. TODO: make a better way to see the vnode patching process(maybe a visualized way? log? which can see each node's changes)

2. FIXED: checkbox input jsx binding

because domProps are not set properly

# 2021-01-03

1. (TODO) deal with `domProps`, what will be included into domProps and how to set these attributes in dom element? need to learn from Vue's `updateDOMProps()` function

    1. (DONE) checked

    2. value

    3. selected

    4. muted

    5. textContent(it is prop, not in attr)

    6. innerHTML

in summary of `HTML attribute vs. DOM property`, attributes are defined by HTML. Properties are defined by the DOM (Document Object Model).

attributes initialize DOM properties and then they are done. Property values can change; attribute values can't.

A few HTML attributes have 1:1 mapping to properties. id is one example.

Some HTML attributes don't have corresponding properties. colspan is one example.

Some DOM properties don't have corresponding attributes. textContent is one example.

Many HTML attributes appear to map to properties ... but not in the way you might think!

(https://stackoverflow.com/questions/6003819/what-is-the-difference-between-properties-and-attributes-in-html)

2. TODO: some directive syntax sugars in JSX(vModel, vShow...)

3. TODO: $refs!!

```html
<input type="text" class="edit" ref="{`inputEdit-${todo.id}`}" />
```

should add each ref element to the `this.refs`. this means need to add to instance.

# 2021-01-04

1. $refs can work on both element and component

    1. element (DONE)

    2. component

2. (DONE) include css into index.html.

(no need to setup css-loader and style-loader because this is not included in js files)

# 2021-01-06

1. (DONE) Milestone: make TODO APP works now

2. make more demos to add APIs and test, before improving the code

    1. Tree list(DONE)

    2.

# 2021-01-07

1. (DONE) implement `$emit` for tree demo

    Question: $emit should invoke events callback in parent component, but why in current vm(in vue source code)?

    because current vm has parent listeners?

    need to understand vue event management from the beginning!

2. (DONE)`v-show` runtime directive

    NOTE: how to update elm if v-show removed in new vnode? current solution is enough?

3. look into `createPatchFunction` in detail, especially for the hooks and modules at the beginning.

# 2021-01-08

1. refactor observer and check if there is a bug in watcher and dep

    0. (DONE) refactor unit tests of observer!

    1. (DONE) pass unit test

    2. (DONE) downgrade webpack to v4 until karma-webpack updates!

2. (DONE) make observer as perfect as vue's, including `set` and `del`

# 2021-01-10

1. (DONE) right now totally follow Vue's observe and I feel it created extra dep instance...maybe point to the root one and avoid creating new ones for children.

(TODO) should carefully consider this point again and maybe it is possible to `improve`.

and maybe check code of vue3

```js
const obj = {
    a: {
        b: 2,
    },
};
```

after `observeData(obj)` and `obj.a.b` will generate 3 dep connecting to watcher, because the observer instance of a will be the additional one compared with the previous way.

Q: Why need to keep a dep in observer instance and where will the be used?

Ans: when add a new key or delete a key, need to use observer's dep to notify

before, I just change the observer's dep to key's dep, so looks like my way has one dep less than vue's way.

2. (DONE) implement `set` and `del`

# 2021-01-11

1. make more demos to add APIs and test, before improving the code

    1. Tree list (DONE)

    2. Modal

        2.1 transition

        2.2 (DONE) slot

# 2021-01-12

1. there are 2 types of slots:

    1. normal slot (DONE)

    2. scoped slot (DONE)

2. transition

    1. is there a way to use jsx and css to implement transition? and make it as a syntax sugar？

    2. NOTE: why need a transition built-in component? is it possible to achieve the same effect by pure css?

# 2021-01-13

Vue 提供了 transition 的封装组件，在下列情形中，可以给任何元素和组件添加进入/离开过渡

条件渲染 (使用 v-if)
条件展示 (使用 v-show)
动态组件
组件根节点

1. maybe I also need to learn more about css trnasition(Animation)

2. start writing `transition` while learning from source code of vue 2.0

# 2021-01-14

1. continue on `transition`

其实 enter 状态的这个函数它主要做的事情就是管理 v-enter/v-enter-active/v-enter-to 这三个 class 的添加和删除，具体的动画是用户定义的

transition 以插槽的形式对内部单一的子节点进行动画的管理，

在渲染阶段就会往子节点的 VNode 上挂载一个 transition 属性，

表示它的一个被 transition 组件包裹的节点，

在 patch 阶段就会执行 transition 组件内部钩子，

钩子里分为 enter 和 leave 状态，在这个被包裹的子节点上使用 v-if 或 v-show 进行状态的切换。

2. NOTE: 今天明白了，我 patch 文件里的 switch statement，在 vue 里用了 cbs 里的 hooks 代替。

hooks 里的那些 updateAttrs 等等函数，在 modules 文件夹下。

3. TODO: need to play with vue transitin and learn more details about how to use it and releated APIs

4. FIXED: `Sub.options = { ...extendOptions, ...Aue.options };` lost props

    no, this is not the actualy bug...

    `console.log` is not reliable when debugging object's value...

    because it just print things based on reference, and this is not a snapshoot at that time.

    if you change the obj after console.log....you will see the content of obj that changed already(if you click to expand obj content in browser)...

# 2021-01-16

1. learn `raf` and use it to replace `setTimeout` in transition example.

2. (DONE) i cannot make my example work with `raf`, but article's example works fine...

# 2021-01-21

1. no need to implement a perfect transition module as Vue.

just implement the basic example and fully understand Vue's transition.

maybe in my Aue, make transition as a independent package. Only install when needed.

2. TODO: because of `transition module`, I realized I may need to use a better way to manage lifecycle of elements.

for example, when leave transition and need to remove element, how to combine them better

Vue uses hooks to call element's lifecycle fn.

I split them into createElm and use `switch` statement to manage props.

but in transition, if I want to use setTimeout to remove element, how should I do?

Before remove, call a hook(maybe call it destroy hook), in this hook check transition first, then remove?

# 2021-02-20

1. refresh my mind about the progress before my vacation

    1.1 slot

    1.2 transition

2. contine to implement transition

# 2021-02-24

1. (DONE) finish basic transition enter part

2. (DONE) finish basic transition leave part

problem#1:

when trying to remove a vnode, the vnode is `transition` component itself, need to find the first node in transition children.

3. TODO: how to load multiple modules in patch.js in Vue2.0. need to do more research:

```js
0: {create: ƒ updateAttrs(oldVnode /*: VNodeWithData*/ , vnode /*: VNodeWithData*/ ), update: ƒ updateAttrs(oldVnode /*: VNodeWithData*/ , vnode /*: VNodeWithData*/ )}
1: {create: ƒ ..., update: ƒ ...}
2: {create: ƒ, update: ƒ}
3: {create: ƒ, update: ƒ}
4: {create: ƒ, update: ƒ}
5: {create: ƒ, remove: ƒ}
6: {create: ƒ, update: ƒ, destroy: ƒ}
7: {create: ƒ, update: ƒ, postpatch: ƒ, destroy: ƒ}
```
