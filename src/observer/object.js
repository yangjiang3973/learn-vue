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
    // TODO: check if this is added to root data level, if so, need proxy and update
    if (this.__ob__.vm) {
        this.__ob__.vm._proxyData(keyPath);
        this.__ob__.vm._digest();
    } else this.__ob__.notify();
};

Object.prototype['$delete'] = function (keyPath) {
    if (!this.hasOwnProperty(keyPath)) return;
    delete this[keyPath]; // delete from _data
    // if root level, delete from vm
    if (this.__ob__.vm) {
        this.__ob__.vm._unproxyData(keyPath);
        this.__ob__.vm._digest();
    } else this.__ob__.notify();
};
