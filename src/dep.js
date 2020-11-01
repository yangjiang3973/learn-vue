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
        // Dep.target = null; // TODO: should not remove Dep.target right after adding a dep. This taget may have multiple deps
    }

    addSub(sub) {
        this.subs.push(sub);
    }

    notify() {
        this.subs.forEach((sub) => {
            // sub.update(newVal, val);
            sub.update();
        });
    }
}

module.exports.Dep = Dep;
