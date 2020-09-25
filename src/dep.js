let uid = 0;

class Dep {
    constructor() {
        this.id = uid++;
        this.subs = [];
    }

    addSub(sub) {
        this.subs.push(sub);
    }

    notify() {
        this.subs.forEach((sub) => {
            sub.update();
        });
    }
}

module.exports.Dep = Dep;
