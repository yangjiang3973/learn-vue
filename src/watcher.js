const batcher = require('./batcher');
const config = require('./config');
// NOTE: curious about details of require. If filters are not used, will it occupy memory space?
const filtersList = require('./filters');

let uid = 0;

class Watcher {
    constructor(vm, exp, cb, options) {
        this.cb = cb;
        this.vm = vm;
        this.exp = exp;
        this.deps = []; // NOTE: use an array to store all deps now， why need this(dep already has subs of watchers)
        this.options = options;
        this.id = ++uid; // uid for batching
        vm._watcherList.push(this);
    }
    initUpdate() {
        // generate new value(include all dependencies)
        // TODO: refactor the keyPath(Maybe the test case is not strong)
        // call parser
        // NOTE: this is a temp solution, use getter please
        let newVal;
        if (this.exp.includes('.')) {
            this.exp.split('.');
            newVal = eval(`this.vm.` + this.exp);
        } else if (this.exp.includes('[')) {
            console.log('this.vm.' + this.exp);
            newVal = eval('this.vm.' + this.exp);
            console.log('Watcher -> update -> newVal', newVal);
        } else newVal = this.vm[this.exp];
        // apply filters to new value first
        const { filters } = this.options;
        filters.forEach((filter) => {
            newVal = filtersList[filter.name](newVal);
        });
        // this.cb(newVal, val);
        this.cb(newVal);
    }

    // push watcher that need to update to batcher's queue
    update() {
        if (!config.async) {
            this.run();
        } else {
            batcher.push(this);
        }
    }

    run() {
        console.log('watcher update here');
        let newVal;
        if (this.exp.includes('.')) {
            this.exp.split('.');
            newVal = eval(`this.vm.` + this.exp);
        } else if (this.exp.includes('[')) {
            console.log('this.vm.' + this.exp);
            newVal = eval('this.vm.' + this.exp);
            console.log('Watcher -> update -> newVal', newVal);
        } else newVal = this.vm[this.exp];
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
