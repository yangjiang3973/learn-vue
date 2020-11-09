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
        let temp = obj.a.b;
        Dep.target = null;
        expect(watcher.deps.length).toBe(2);

        obj.a.b = 3;
        expect(watcher.update.calls.count()).toBe(1);

        obj.a = { b: 4 };
        expect(watcher.update.calls.count()).toBe(2);
        // expect(oldA.__ob__.deps.length).toBe(0);
        // expect(obj.a.__ob__.deps.length).toBe(1);

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

    it('observing $add/$set/$delete', function () {});
});
