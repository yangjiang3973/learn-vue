1. 看到一个很有迷惑性的代码片段：

```js
node2Fragment(el) {
    var fragment = document.createDocumentFragment(),
        child;
    while ((child = el.firstChild)) {
        fragment.appendChild(child);
    }
    return fragment;
}
```

疑惑之处在于，好像没有更新 loop 循环的条件，貌似死循环。

其实关键在于，如果被插入的节点已经在文档树中，则该节点会首先从原先的位置移除（所以 el.firstChild 在变），然后再插入到指定位置。
