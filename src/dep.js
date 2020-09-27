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
        this.addSub(Dep.target);
        this.target = null;
    }

    addSub(sub) {
        this.subs.push(sub);
    }

    notify(newVal, val) {
        this.subs.forEach((sub) => {
            sub.update(newVal, val);
        });
    }
}

module.exports.Dep = Dep;
