let uid = 0;

class Dep {
    constructor() {
        this.id = uid++;
        this.subs = [];
    }

    static target = null;

    depend() {
        Dep.target.addDep(this);
    }

    addSub(sub) {
        this.subs.push(sub);
    }

    removeSub(sub) {
        var i = this.subs.indexOf(sub);
        if (i > -1) this.subs.splice(i, 1);
    }

    notify() {
        this.subs.forEach((sub) => {
            sub.update();
        });
    }
}

// The current target watcher being evaluated.
// This is globally unique because only one watcher
// can be evaluated at a time.
const targetStack = [];

export const pushTarget = function pushTarget(target) {
    targetStack.push(target);
    Dep.target = target;
};

export const popTarget = function popTarget() {
    targetStack.pop();
    Dep.target = targetStack[targetStack.length - 1];
};

export default Dep;
