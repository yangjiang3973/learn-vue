# RegExp

RegExp 构造函数可接受两个参数：

pattern： 特定语法的规则，用以描述匹配字符串的特征
flag： 用以限定正则表达式行为的标志，该参数可选

```js
const reg_exp = new RegExp(/^[a-zA-Z]+[0-9]*\W?_$/, 'gi');
// 二者等价
const reg_exp = /^[a-zA-Z]+[0-9]*\W?_$/gi;
```

## 有以下几种 flag：

1. g： 全局模式，匹配**全部**符合的字符串片段（若无 g，默认是第一个匹配上就返回）

2. i: igonre cases，忽略大小写，（若无 i，默认大小写敏感）

3. m: multiple lines，多行搜索，^与$将匹配行的开始与结束；不启用的话，^与$将匹配整个字符串的开始与结束。

## pattern 如何描述字符串？
