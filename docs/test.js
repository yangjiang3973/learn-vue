// var Student = {
//     name: 'Robot',
//     height: 1.2,
//     run: function () {
//         console.log(this.name + ' is running...');
//     },
// };

// var xiaoming = {
//     name: '小明',
// };

// xiaoming.__proto__ = Student;

// console.log(xiaoming.name);
// xiaoming.run();

// var Student = {
//     name: 'Robot',
//     height: 1.2,
//     run: function () {
//         console.log(this.name + ' is running...');
//     },
// };

// function createStudent(name) {
//     // 基于Student原型创建一个新对象,proto自动指向该对象.
//     var s = Object.create(Student);
//     console.log('createStudent -> s', s);
//     // 初始化新对象:
//     s.name = name;
//     return s;
// }

// var xiaoming = createStudent('小明');
// xiaoming.run(); // 小明 is running...
// console.log('xiaoming.__proto__ === Student', xiaoming.__proto__ === Student);

// function Student(name) {
//     this.name = name;
//     this.test = 'test';
//     this.hello = function () {
//         console.log('Hello, ' + this.name + '!');
//     };
// }

// var xiaoming = new Student('小明');
// var anhong = new Student('安红');

// console.log('xiaoming.name', xiaoming.name);
// console.log('anhong.name', anhong.name);
// Student.prototype.hello = function () {
//     console.log('Hello, ' + this.name + '!');
// };
// xiaoming.hello(); // Hello, 小明!
// anhong.hello(); // Hello, 安红!

// console.log(xiaoming.hello === anhong.hello);

// function PrimaryStudent(props) {
//     // 调用Student构造函数，绑定this变量:
//     Student.call(this, props.name);
//     this.grade = props.grade || 1;
// }

// var yang = new PrimaryStudent({ name: 'Yang', grade: 100 });
// console.log('yang', yang);

// function Student(props) {
//     this.name = props.name;
//     this.test = props.test;
//     this.hello = function () {
//         console.log('Hello, ' + this.name + '!');
//     };
// }

// Student.prototype.testStudent = 'a';

// function PrimaryStudent(props) {
//     Student.call(this, props);
//     this.grade = props.grade || 1;
// }

// PrimaryStudent.prototype = Object.create(Student.prototype);
// PrimaryStudent.prototype.contrustor = PrimaryStudent;
// PrimaryStudent.prototype.testPrimaryStudent = 'b';
// console.log('PrimaryStudent.prototype', PrimaryStudent.prototype);

// var inst = new PrimaryStudent({ grade: 100 });
// console.log('inst', inst.__proto__); // __proto__ is ref of PrimaryStudent? so it links to Student
// console.log(inst.hasOwnProperty('testPrimaryStudent'));

//////////////////////////////////////////////////////
// function Student(props) {
//     this.name = props.name;
//     this.test = props.test;
//     this.hello = function () {
//         console.log('Hello, ' + this.name + '!');
//     };
// }

// Student.prototype.testStudent = 'a';

// function PrimaryStudent(props) {
//     Student.call(this, props);
//     this.grade = props.grade || 1;
// }

// var proto = new Student({ name: 'yang' });

// proto.testPrimaryStudent = 'b';

// PrimaryStudent.prototype = proto;

// var inst = new PrimaryStudent({ grade: 100 });
// console.log('inst', inst.__proto__);
// console.log(inst.hasOwnProperty('testPrimaryStudent'));

// var a = { x: 1, y: 2 };
// var b = Object.create(a, {
//     z: {
//         value: 3,
//         enumerable: true,
//         configurable: true,
//         writable: true,
//     },
// });
// console.log(b.z);
// console.log(b.x);

// class Student {
//     constructor(name) {
//         this.name = name;
//     }
//     hello() {
//         console.log('name:', this.name);
//     }
// }

// const s = new Student('yang');
// s.hello();

// let A = function (name) {
//     this.name = name;
// };

// let B = function () {
//     console.log('B -> arguments', arguments);
//     A.apply(this, arguments);
// };

// B.prototype.getName = function () {
//     return this.name;
// };

// let b = new B('seven');
// console.log(b.getName());

// function test() {
//     Array.prototype.push.call(arguments, 4);
//     console.log(arguments);
// }
// test(1, 2, 3);
// Function.prototype.uncurrying = function () {
//     let self = this;
//     return function () {
//         let obj = Array.prototype.shift.call(arguments);
//         return self.apply(obj, arguments);
//     };
// };

// let push = Array.prototype.push.uncurrying();

// (function () {
//     push(arguments, 4); // currying, so add more params
//     console.log('arguments', arguments);
// })(1, 2, 3);

// Singleton: 1
// let Singleton = function (name) {
//     this.name = name;
//     this.instance = null;
// };

// Singleton.prototype.getName = function () {
//     console.log(this.name);
// };

// Singleton.getInstance = function (name) {
//     if (!this.instance) {
//         this.instance = new Singleton(name);
//     }
//     return this.instance;
// };

// let a = Singleton.getInstance('aaa');
// let b = Singleton.getInstance('bbb');

// a.getName();
// b.getName();

// Singleton: 2
let Singleton = function (name) {
    this.name = name;
};

Singleton.prototype.getName = function () {
    console.log(this.name);
};

Singleton.getInstance = (function () {
    let instance = null;
    return function (name) {
        if (!instance) {
            instance = new Singleton(name);
        }
        return instance;
    };
})();

let a = Singleton.getInstance('aaa');
let b = Singleton.getInstance('bbb');

a.getName();
b.getName();
