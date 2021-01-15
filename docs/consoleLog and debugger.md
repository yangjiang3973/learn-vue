慎用 console.log

因为 console.log 打印出来的，是该地址的值，并不能保证是当时的 snapshot。

比如，打印一个 object：

console.log(object);

之后修改了 object 内部

可能浏览器里 log 出来的，再点击展开，显示的是修改后的值。

```js
const a = {
    foo: 1,
};

const b = {
    bar: 2,
};

const Sub = {};

Sub.options = { ...a, ...b };

console.log(Sub.options);

Sub.options.foo = {};
```
