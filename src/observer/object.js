// function $add(keyPath, val) {
//     if (this.hasOwnProperty(key)) return;

// }

// Object.defineProperty(Object.prototype, '$add', {
//     value: val,
//     enumerable: false,
//     writable: true,
//     configurable: true,
// });

Object.prototype['$add'] = function (keyPath, val) {
    if (this.hasOwnProperty(keyPath)) return;
    const obj = {};
    obj[keyPath] = val;
    this.__ob__.observe(obj);
    // TODO: check if this is added to root data level, if so, need proxy
    this.__ob__.notify();
};
