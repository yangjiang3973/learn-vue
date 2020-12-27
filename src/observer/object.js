// Object.prototype['$add'] = function (keyPath, val) {
//     if (this.hasOwnProperty(keyPath)) return;
//     // if not observed, just finish this operation and return
//     if (!this.__ob__) {
//         this[key] = val;
//         return;
//     }
//     const obj = {};
//     obj[keyPath] = val;
//     this.__ob__.defineReactive(this.__ob__.value, keyPath, val);
//     // TODO: check if this is added to root data level, if so, need proxy and update
//     if (this.__ob__.vm) {
//         this.__ob__.vm._proxyData(keyPath);
//         this.__ob__.vm._digest();
//     } else this.__ob__.notify();
// };

// Object.prototype['$delete'] = function (keyPath) {
//     if (!this.hasOwnProperty(keyPath)) return;
//     delete this[keyPath]; // delete from _data
//     if (!this.__ob__) return;

//     // if root level, delete from vm
//     if (this.__ob__.vm) {
//         this.__ob__.vm._unproxyData(keyPath);
//         this.__ob__.vm._digest();
//     } else this.__ob__.notify();
// };

// Object.prototype['$set'] = function (keyPath, val) {
//     this.$add(keyPath, val);
//     this[keyPath] = val;
// };
