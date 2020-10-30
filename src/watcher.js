// NOTE: curious about details of require. If filters are not used, will it occupy memory space?
const filtersList = require('./filters');

let uid = 0;

class Watcher {
    constructor(vm, exp, cb, options) {
        this.cb = cb;
        this.vm = vm;
        this.exp = exp;
        this.options = options;
    }
    update(newVal, val) {
        // apply filters to new value first
        const { filters } = this.options;
        filters.forEach((filter) => {
            newVal = filtersList[filter.name](newVal);
        });
        this.cb(newVal, val);
    }
}

module.exports.Watcher = Watcher;
