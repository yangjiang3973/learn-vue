let uid = 0;

class Dep {
    constructor() {
        this.id = uid++;
        this.subs = [];
    }

    static target = null;

    // why need to ask watcher to addToDep?
    // depend() {
    //     Dep.target.addToDep(this);
    // }
    depend() {
        // this.addSub(Dep.target);
        // Dep.target.addDep(this);
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
            // sub.update(newVal, val);
            sub.update();
        });
    }
}

module.exports.Dep = Dep;
