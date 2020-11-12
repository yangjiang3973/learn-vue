# vue-analysis

之所以要这样，是因为用户的代码当中是可能多次修改数据的，而每次修改都会同步通知到所有订阅该数据的 watcher，
而立马执行将数据写到 DOM 上是肯定不行的，那就只是把 watcher 加入数组。
等到当前 task 执行完毕，所有的同步代码已经完成，那么这一轮次的数据修改就已经结束了，
这个时候我可以安安心心的去将对监听到依赖变动的 watcher 完成数据真正写入到 DOM 上的操作，
这样即使你在之前的 task 里改了一个 watcher 的依赖 100 次，我最终只会计算一次 value、改 DOM 一次。
一方面省去了不必要的 DOM 修改，另一方面将 DOM 操作聚集，可以提升 DOM Render 效率。

那为什么一定要用 MutationObserver 呢？不，并没有一定要用 MO，只要是 microtask 都可以。
在最新版的 Vue 源码里，
优先使用的就是 Promise.resolve().then(nextTickHandler)来将异步回调放入到 microtask 中（MO 在 IOS9.3 以上的 WebView 中有 bug），
没有原生 Promise 才用 MO。

Vue 在两个地方用到了上述 nextTick：

Vue.nextTick 和 Vue.prototype.\$nextTick 都是直接使用了这个 nextTick
在 batcher 中，也就是 watcher 观测到数据变化后执行的是 nextTick(flushBatcherQueue)，flushBatcherQueue 则负责执行完成所有的 dom 更新操作。
