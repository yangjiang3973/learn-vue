const { Dep } = require('./dep');
const batcher = require('./batcher');
const config = require('./config');
// NOTE: curious about details of require. If filters are not used, will it occupy memory space?
const filtersList = require('./filters');

let uid = 0;

class Watcher {
    constructor(vm, exp, cb, options) {
        this.vm = vm;
        this.exp = exp;
        this.cbs = [cb];
        this.options = options || {};
        this.id = ++uid; // uid for batching
        //* NOTE: why need this active flag
        // this.active = true
        this.deps = {}; // NOTE: Vue use `Object.create(null);`, I don't know why??
        vm._watcherList.push(this);
        this.user = !!this.options.user;
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
        } else {
            newVal = this.vm[this.exp];
        }
        // apply filters to new value first
        const { filters } = this.options;
        if (filters) {
            filters.forEach((filter) => {
                newVal = filtersList[filter.name](newVal);
            });
        }
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
        if (this.value !== newVal) {
            // keep oldVal and update this.value
            let oldVal = this.value;
            this.value = newVal;
            this.cbs.forEach((cb) => {
                cb(newVal, oldVal);
            });
        }
    }

    // TODO: need to refactor later
    addDep(dep) {
        this.deps[dep.id] = dep;
        dep.addSub(this);
    }

    addCb(cb) {
        this.cbs.add(cb);
    }

    removeCb(cb) {
        if (this.cbs.length === 1 && cb === this.cbs[0]) {
            // remove the watcher itself from dep list
            // this is why watcher need to keep a dep list
            this.teardown();
        } else {
            const i = this.cbs.indexOf(cb);
            if (i > -1) this.cbs.splice(i, 1);
        }
    }

    teardown() {
        // if(this.active===true)
        var i = this.vm._watcherList.indexOf(this);
        if (i > -1) {
            this.vm._watcherList.splice(i, 1);
        }
        this.deps.forEach((dep) => {
            dep.removeSub(this);
        });
    }
}

module.exports.Watcher = Watcher;
