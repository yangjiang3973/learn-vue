// let target = {
//     msg1: 'hello',
//     msg2: 'everyone',
// };

// const handler = {
//     // intercept `get` method
//     get: function (target, prop, reveiver) {
//         // return 'world';
//         // return target[prop];
//         if (prop === 'msg2') return 'world';
//         return Reflect.get(...arguments);
//     },
// };

// const proxy = new Proxy(target, handler);

// console.log(proxy.msg1);
// console.log(proxy.msg2);

/* NOTE: forwarding proxy */

// const target = {};
// const handler = {
//     get: function (target, prop, receiver) {
//         console.log('get');
//         return Reflect.get(...arguments);
//     },
// };
// const p = new Proxy(target, handler);

// p.a = 3;
// // a:3 is also added to target
// console.log(target.a);

/* NOTE:  add validation to `set`*/

// let validator = {
//     set: function (obj, prop, val) {
//         if (prop === 'age') {
//             if (val > 200) throw new RangeError('too old!');
//         }

//         obj[prop] = val;

//         return true;
//     },
// };

// const person = new Proxy({}, validator);

// person.age = 100;
// console.log(person.age);
// person.age = 300;

/* NOTE: extent a constructor with a new constructor */

// function extend(sup, base) {
//     const descriptor = Object.getOwnPropertyDescriptor(
//         base.prototype,
//         'constructor'
//     );
//     console.log(base.prototype);
//     base.prototype = Object.create(sup.prototype);
//     const handler = {
//         // target is useless, just a placeholder
//         construct: function (target, args) {
//             let obj = Object.create(base.prototype);
//             this.apply(null, obj, args);
//             return obj;
//         },
//         apply: function (target, that, args) {
//             sup.apply(that, args);
//             base.apply(that, args);
//         },
//     };
//     // constructor points to prototype, so here make a new prototypt by proxy
//     const proxy = new Proxy(base, handler);
//     // then constructor points back to the new one
//     descriptor.value = proxy;
//     Object.defineProperty(base.prototype, 'construct', descriptor);
//     return proxy;
// }

// const Person = function (name) {
//     this.name = name;
// };

// const Boy = extend(Person, function (name, age) {
//     this.age = age;
// });

// Boy.prototype.gender = 'M';

// let Tony = new Boy('Tony', 13);

// console.log(Tony.gender); // "M"
// console.log(Tony.name); // "Tony"
// console.log(Tony.age); // 13

/* NOTE: */
