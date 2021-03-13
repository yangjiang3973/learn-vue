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

// let target = {
//     msg1: 'hello',
//     msg2: 'everyone',
//     obj: {
//         a: '1111',
//     },
// };

// const handler = {
//     // intercept `get` method
//     get: function (target, prop, reveiver) {
//         console.log('intercept');
//         return Reflect.get(...arguments);
//     },
//     set: function (target, prop) {
//         console.log('also know new prop');
//     },
// };

// const proxy = new Proxy(target, handler);
// // const c = proxy.obj;
// // console.log(proxy.msg1);
// // console.log(proxy.msg2);
// // console.log(c.a);
// proxy.obj.a = '22222';
// // proxy.msg1 = '1';
// proxy.x = 'qqq';

/* NOTE: Array*/

// let t = [1, 2, 3];

// const handler = {
//     set: function (t, k) {
//         console.log('change!');
//         t[9] = 0;
//     },
// };

// const proxy = new Proxy(t, handler);

// proxy[9] = 0;
// // proxy.push(0);
// console.log(proxy);

//* NOTE: prototype chain issue

// let objParent = { a: 1 };
// let objChild = {};

// const handler = {
//     // intercept `get` method
//     get: function (target, prop, reveiver) {
//         console.log('get');
//         return Reflect.get(...arguments);
//     },
//     set: function (target, prop, value, receiver) {
//         console.log('set');
//         Reflect.set(target, prop, value, receiver);
//         return true;
//     },
// };

// const proxyParent = new Proxy(objParent, handler);
// const proxyChild = new Proxy(objChild, handler);
// Object.setPrototypeOf(proxyChild, proxyParent);

// // console.log(proxyChild.a);
// proxyChild.a = 8;
// console.log('🚀 ~ file: demo.js ~ line 171 ~ proxyChild.a', proxyChild.a);
// console.log('🚀 ~ file: demo.js ~ line 171 ~ proxyChild.a', proxyParent.a);

// let target = { a: 1 };
// let tt = { v: 2 };
// Object.setPrototypeOf(target, tt);
// console.log(Reflect.has(target, 'a'));
// console.log(Reflect.has(target, 'v'));

// NOTE: Reflect

// let a = {
//     func: () => {
//         console.log('call');
//     },
// };

// Reflect.get(a, 'func');

// let arr = [1, 2, 3];
// const handler = {
//     get: function (target, prop, reveiver) {
//         console.log('get');
//         return Reflect.get(...arguments);
//     },
//     set: function (target, prop, value, receiver) {
//         console.log('set');
//         Reflect.set(target, prop, value, receiver);
//         return true;
//     },
//     ownKeys(target) {
//         console.log('ownKeys');
//         return Reflect.ownKeys(target);
//     },
//     has(target, key) {
//         if (key[0] === '_') {
//             return false;
//         }
//         return key in target;
//     },
// };
// const proxy = new Proxy(arr, handler);

// for (const key in proxy) {
//     console.log(key);
// }

// const map = new Map();
// map.set('a', 1);
// map.set('v', 2);

// map.forEach((element, key) => {
//     console.log(element, key);
// });
