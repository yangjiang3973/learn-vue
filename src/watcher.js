let uid = 0;

class Watcher {
    constructor(vm, exp, cb, options) {
        this.cb = cb;
        this.vm = vm;
        this.exp = exp;
    }
    // addToDep(dep) {
    //     dep.addSub(this);
    // }
    update(newVal, val) {
        this.cb(newVal, val);
    }

    // get(key) {
    //     Dep.target = this;
    //     this.value = data[key]; // 这里会触发属性的getter，从而添加订阅者
    //     Dep.target = null;
    // }
}

module.exports.Watcher = Watcher;
