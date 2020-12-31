import Dep, { pushTarget, popTarget } from './dep';
import { queueWatcher } from './batcher';
import config from './config';

// NOTE: curious about details of require. If filters are not used, will it occupy memory space?
// remove filters in watchers
// import filtersList from './filters';

import { parseExpression } from '../src/parsers/expression';

let uid = 0;

let once = new Set();
function deepTouch(val) {
    if (typeof val === 'object') {
        let childVal;
        Object.keys(val).forEach((key) => {
            if (key === '__ob__') return;
            childVal = val[key];
            console.log('deepTouch -> childVal', childVal);
            if (typeof childVal === 'object') {
                if (once.has(childVal.__ob__.dep.id)) {
                    return;
                } else {
                    once.add(childVal.__ob__.dep.id);
                }
                deepTouch(childVal);
            }
        });
    }
}

class Watcher {
    constructor(vm, exp, cb, options) {
        this.vm = vm;
        this.exp = exp;
        this.cbs = [cb];
        this.options = options || {};
        this.deep = this.options.deep; // really need to make a copy from this.options?
        this.id = ++uid; // uid for batching
        //* NOTE: why need this active flag
        // this.active = true
        this.deps = {}; // NOTE: Vue use `Object.create(null);`, I don't know why??
        vm._watcherList.push(this);
        this.user = !!this.options.user;

        if (typeof exp === 'function') {
            this.getter = exp;
        } else {
            const res = parseExpression(exp, this.twoWay);
            this.getter = res.get;
        }

        this.value = this.getValue();
    }

    getValue() {
        // Dep.target = this; // NOTE: right now set here, maybe change later
        pushTarget(this);
        let newVal;
        const scope = this.scope || this.vm;

        try {
            newVal = this.getter.call(scope, scope); // need try...catch for uncaught error: {{ z.x.y }} and z is undefined
        } catch (error) {
            console.error(error);
            console.error(`invalid expression: ${this.exp}`); // TODO: make a warn function to display error mesg
        }

        // touch child data to let this watcher subscribe deeply
        if (this.deep) {
            deepTouch(newVal);
        }

        // apply filters to new value first
        // const { filters } = this.options;
        // if (filters) {
        //     filters.forEach((filter) => {
        //         newVal = filtersList[filter.name](newVal);
        //     });
        // }
        popTarget();
        // Dep.target = null;
        return newVal;
    }

    // push watcher that need to update to batcher's queue
    update() {
        if (!config.async) {
            this.run();
        } else {
            queueWatcher(this);
        }
    }

    run() {
        let newVal = this.getValue();

        // val maybe a obj and change child property will not change its ref
        if (this.value !== newVal || typeof this.value === 'object') {
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
        this.cbs.push(cb);
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

        Object.keys(this.deps).forEach((key) => {
            this.deps[key].removeSub(this);
        });
        // this.deps.forEach((dep) => {
        //     dep.removeSub(this);
        // });
        this.vm = this.cb = null;
    }
}

export default Watcher;
