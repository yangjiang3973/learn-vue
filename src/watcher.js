// NOTE: curious about details of require. If filters are not used, will it occupy memory space?
const filtersList = require('./filters');

let uid = 0;

class Watcher {
    constructor(vm, exp, cb, options) {
        this.cb = cb;
        this.vm = vm;
        this.exp = exp;
        // this.deps = []; // NOTE: use an array to store all deps now
        this.options = options;
    }
    update() {
        // generate new value(include all dependencies)
        let newVal = this.vm[this.exp];
        // apply filters to new value first
        const { filters } = this.options;
        filters.forEach((filter) => {
            newVal = filtersList[filter.name](newVal);
        });
        // this.cb(newVal, val);
        this.cb(newVal);
    }
}

module.exports.Watcher = Watcher;
