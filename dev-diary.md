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

2. TODO: in compile, still use 3 stages but not use closures to create link for more directives and other features.

so maybe can understand why vue uses this way.

3. TODO: start writing more directives and refactor previous code(especially compile part)

# 2020-10-20

1. finished the main logic structure and make `v-text` work

2. TODO: add unit tests like vue
