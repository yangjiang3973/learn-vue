const { Observer } = require('../../../src/observer/observer');
const { Dep } = require('../../../src/dep');

describe('Observer', function () {
    it('create an object', function () {
        const obj = {
            a: {},
            b: {},
        };
        const obInstance = new Observer(obj);
        expect(obInstance instanceof Observer).toBe(true);
    });

    it('observing object prop change', function () {
        const obj = {
            a: {
                b: 2,
            },
        };
        const obInstance = new Observer(obj);
        // mock a watcher
        const watcher = {
            deps: [],
            addDep: function (dep) {
                this.deps.push(dep);
                dep.addSub(this);
            },
            update: jasmine.createSpy(),
        };
        Dep.target = watcher;
        let temp = obj.a.b; // obj.a.b is different from obj[a.b], I did not found a bug in watcher's update: this.vm[this.exp]
        Dep.target = null;
        expect(watcher.deps.length).toBe(2);

        obj.a.b = 3;
        expect(watcher.update.calls.count()).toBe(1);

        let oldA = obj.a;
        obj.a = { b: 4 };
        expect(watcher.update.calls.count()).toBe(2);
        // TODO: ignore line 42 now, need to understand `vue/src/observer/index.js` line 189
        // expect(oldA.__ob__.deps.length).toBe(0);
        expect(obj.a.__ob__.deps.length).toBe(1);

        // recollect dep
        watcher.deps = [];
        Dep.target = watcher;

        let temp2 = obj.a.b;
        Dep.target = null;
        expect(watcher.deps.length).toBe(2);
        // set on the swapped object
        obj.a.b = 5;
        expect(watcher.update.calls.count()).toBe(3);
    });

    it('observing $add/$set/$delete', function () {
        const obj = { a: 1 };
        const ob = new Observer(obj);
        var dep = new Dep();
        ob.deps.push(dep);
        spyOn(dep, 'notify');
        obj.$add('b', 2);
        expect(obj.b).toBe(2);
        expect(dep.notify.calls.count()).toBe(1);
        // obj.$delete('a');
        // expect(obj.hasOwnProperty('a')).toBe(false);
        // expect(dep.notify.calls.count()).toBe(2);
        // // should ignore adding an existing key
        // obj.$add('b', 3);
        // expect(obj.b).toBe(2);
        // expect(dep.notify.calls.count()).toBe(2);
    });
});
