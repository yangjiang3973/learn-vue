// module.exports.add = function (a, b) {
//     return a + b;
// };

// function Log(msg) {
//     console.log(msg);
// }

// Log('test2.js run');

// class Student {
//     constructor(name) {
//         if (name === 'a') return undefined;
//         this.name = name;
//     }
// }

// const aa = new Student('a');

// console.log(aa);

// const obj = {};

// Object.defineProperty(obj, 'a', {
//     configurable: true,
//     enumerable: true,
//     get: function () {
//         return 123;
//     },
// });

// const property = Object.getOwnPropertyDescriptor(obj, 'a');
// console.log('property', property);

function Watcher() {
    this.value = this.get();
}

Watcher.prototype.get = function () {
    console.log('get!');
};

const watcher = new Watcher();

watcher.value;
watcher.value;
watcher.value;
