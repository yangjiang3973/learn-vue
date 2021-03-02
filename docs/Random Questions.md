1. difference between element and node in DOM?

2. `.babelrc` is called in webpack? when?

why `presets: ['env']` is working before, but need to change to `presets: ['@babel/preset-env']` later?

3. 为什么 link 用了大量的闭包和高阶函数建立 node 和 dir 的关系，不用类似 obj 的数据结构？这样效率高？

4. 为什么要分 compile 和 link 两个不同阶段，有点像广度优先 BFS，而不是 DFS 那样先一路到底？效率高？

5.

```js
export const hasChanged = (value: any, oldValue: any): boolean =>
    value !== oldValue && (value === value || oldValue === oldValue);
```

为什么还要比较自身？因为 NaN!==NaN,为了排除 NaN 这个特殊情况。
