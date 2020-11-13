const { Dep } = require('./dep');
const batcher = require('./batcher');
const config = require('./config');
// NOTE: curious about details of require. If filters are not used, will it occupy memory space?
const filtersList = require('./filters');

let uid = 0;

class Watcher {
    constructor(vm, exp, cb, options) {
        this.cbs = [cb];
        this.vm = vm;
        this.exp = exp;
        // NOTE: use an array to store all deps now， why need this(dep already has subs of watchers)
        // used to remove watchers from dep? not now to implement
        this.deps = [];
        this.options = options;
        this.id = ++uid; // uid for batching
        vm._watcherList.push(this);
        this.value = this.getValue();
    }

    getValue() {
        Dep.target = this; // NOTE: right now set here, maybe change later
        let newVal;
        if (this.exp.includes('.')) {
            this.exp.split('.');
            newVal = eval(`this.vm.` + this.exp);
        } else if (this.exp.includes('[')) {
            newVal = eval('this.vm.' + this.exp);
        } else newVal = this.vm[this.exp];
        // apply filters to new value first
        const { filters } = this.options;
        filters.forEach((filter) => {
            newVal = filtersList[filter.name](newVal);
        });
        Dep.target = null;
        return newVal;
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
        let newVal = this.getValue();
        this.cbs.forEach((cb) => {
            cb(newVal, this.value);
        });
    }

    addCb(cb) {
        this.cbs.add(cb);
    }

    removeCb(cb) {
        if (this.cbs.length === 1 && cb === this.cbs[0]) {
            // remove the watcher itself from sub list
            this.teardown();
        } else {
            const i = this.cbs.indexOf(cb);
            if (i > -1) this.cbs.splice(i, 1);
        }
    }

    teardown() {}
}

module.exports.Watcher = Watcher;
