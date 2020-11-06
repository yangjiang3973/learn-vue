# 基本概念

JavaScript 不区分类和实例的概念，而是通过原型（prototype）来实现面向对象编程。

JavaScript 的原型链和 Java 的 Class 区别就在，它没有“Class”的概念，所有对象都是实例，所谓继承关系不过是把一个对象的原型指向另一个对象而已。

每个实例对象（ object ）都有一个私有属性（称之为 `__proto__` ）指向它的构造函数的原型对象（prototype ）。
只有函数（确切说是构造函数）才有 prototype，它的作用是，构造函数 new 对象的时候，告诉构造函数新创建的对象的原型是谁。

每个 prototype 对象都有一个 constructor 属性，指向它的构造函数本身。
每一个实例也有一个 constructor 属性(???我怎么没发现，而是进图 prototype 的 constructor)，默认调用 prototype 对象的 constructor 属性。
以上二者应该等价。

```js
var Student = {
    name: 'Robot',
    height: 1.2,
    run: function () {
        console.log(this.name + ' is running...');
    },
};

var xiaoming = {
    name: '小明',
};

xiaoming.__proto__ = Student;
```

PS:请注意，上述代码仅用于演示目的。在编写 JavaScript 代码时，不要直接用 `obj.__proto__`去改变一个对象的原型.

`__proto__`已经是 deprecated，如果要用可以用 `Object.getPrototypeOf()` 和 `Object.setPrototypeOf()` 访问器来访问

```js
// 原型对象:
var Student = {
    name: 'Robot',
    height: 1.2,
    run: function () {
        console.log(this.name + ' is running...');
    },
};

function createStudent(name) {
    // 基于Student原型创建一个新对象:
    var s = Object.create(Student);
    // 初始化新对象:
    s.name = name;
    return s;
}

var xiaoming = createStudent('小明');
xiaoming.run(); // 小明 is running...
xiaoming.__proto__ === Student; // true
```

当我们用 obj.xxx 访问一个对象的属性时，JavaScript 引擎先在当前对象上查找该属性，

如果没有找到，就到其原型对象上找，如果还没有找到，就一直上溯到 Object.prototype 对象，最后，如果还没有找到，就只能返回 undefined。

比如：

```js
var arr = [1, 2, 3];

// arr ----> Array.prototype ----> Object.prototype ----> null
```

Array.prototype 定义了 indexOf()、shift()等方法，因此你可以在所有的 Array 对象上直接调用这些方法。

PS: 如果原型链很长，那么访问一个对象的属性就会因为花更多的时间查找而变得更慢，因此要注意不要把原型链搞得太长。

# 构造函数

JavaScript 还可以用一种构造函数的方法来创建对象。它的用法是，先定义一个构造函数，然后可以用关键字 new 来调用这个函数，并返回一个对象：

```js
function Student(name) {
    this.name = name;
    this.hello = function () {
        alert('Hello, ' + this.name + '!');
    };
}

var xiaoming = new Student('小明');
xiaoming.name; // '小明'
xiaoming.hello(); // Hello, 小明!

//xiaoming ----> Student.prototype ----> Object.prototype ----> null
```

# 原型继承

传统的 JAVA 面向对象编程，类的继承实际上是进一步的扩展。JS 不存在典型的类概念，所以继承的概念也不同。

之前定义过一个 Student 构造函数：

```js
function Student(props) {
    this.name = props.name || 'Unnamed';
}

Student.prototype.hello = function () {
    alert('Hello, ' + this.name + '!');
};
```

如果要基于`Student`扩展新的`PrimaryStudent`，可以先定义：

```js
function PrimaryStudent(props) {
    // 调用Student构造函数，绑定this变量:
    Student.call(this, props);
    this.grade = props.grade || 1;
}
//new PrimaryStudent() ----> PrimaryStudent.prototype ----> Object.prototype ----> null
```

这里的关键是`call`，用来将 this 进行绑定传递。但是这还不够，因为原型链没改,需要指向 Student。

`PrimaryStudent.prototype = Student.prototype;`是不对的，这样等于浪费了 PrimaryStudent。

如果 PrimaryStudent.prototype 等价于 Student.prototype，那 PrimaryStudent 存在的意义是什么？

可以借助一个桥接函数 F 来实现，这个 F 可以是个空函数。

PS: 注意任何一个 prototype 对象都有一个 constructor 属性，指向它的构造函数。

因为 constructor 指向构造函数，所以又能看到本身的 prototype，包括他的 constructor 属性，指向它的构造函数。。。变成一个循环

```js
// PrimaryStudent构造函数:
function PrimaryStudent(props) {
    Student.call(this, props);
    this.grade = props.grade || 1;
}

// 空函数F:
function F() {}

// 把F的原型指向Student.prototype:
F.prototype = Student.prototype;

// 把PrimaryStudent的原型指向一个新的F对象，F对象的原型正好指向Student.prototype:
PrimaryStudent.prototype = new F();

// 把PrimaryStudent原型的构造函数修复为PrimaryStudent:
PrimaryStudent.prototype.constructor = PrimaryStudent;

// 继续在PrimaryStudent原型（就是new F()对象）上定义方法：
PrimaryStudent.prototype.getGrade = function () {
    return this.grade;
};

// 创建xiaoming:
var xiaoming = new PrimaryStudent({
    name: '小明',
    grade: 2,
});
xiaoming.name; // '小明'
xiaoming.grade; // 2

// 验证原型:
xiaoming.__proto__ === PrimaryStudent.prototype; // true
xiaoming.__proto__.__proto__ === Student.prototype; // true

// 验证继承关系:
xiaoming instanceof PrimaryStudent; // true
xiaoming instanceof Student; // true
```

还有一种不用架桥函数的办法，就是用 Object.create()：`PrimaryStudent.prototype = Object.create(Student.prototype)`

```js
function Student(name) {
    this.name = name;
    this.test = 'test';
    this.hello = function () {
        console.log('Hello, ' + this.name + '!');
    };
}
function PrimaryStudent(props) {
    Student.call(this, props);
    this.grade = props.grade || 1;
}
PrimaryStudent.prototype = Object.create(Student.prototype);
PrimaryStudent.prototype.contrustor = PrimaryStudent;
var inst = new PrimaryStudent({ name: 'Yang', grage: 100 });
```

# 问题

1. (DONE)关于 prototype 稍微了解了一点原型链的基础，但是更基础的还是不理解，比如 constructor 和 prototype 的关系，constructor 是怎么被用的？

更基础的内容不理解，就没法彻底掌握原型链的用法，比如为啥需要再修复 constructor？

明天拿只笔边学边写草稿，后面再整理。

这个需要像当初学 C++一样慢慢理清楚每一个步骤。

2. 所谓的“指向”有两种意思：

```js
var b = { x: 1, y: 2 };
var a = b; //a指向b

var c = { x: 1, y: 2 };
var d = Object.create(c); // d.__proto__ === c --> true
```

`__proto__`指向某 prototype 是指第一种指向（a===b）
