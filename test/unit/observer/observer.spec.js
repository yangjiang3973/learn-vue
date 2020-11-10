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
        obj.$delete('a');
        expect(obj.hasOwnProperty('a')).toBe(false);
        expect(dep.notify.calls.count()).toBe(2); // accumulated
        // should ignore adding an existing key
        obj.$add('b', 3);
        expect(obj.b).toBe(2);
        expect(dep.notify.calls.count()).toBe(2);
        // $set
        obj.$set('b', 3);
        expect(obj.b).toBe(3);
        expect(dep.notify.calls.count()).toBe(2);
        // set non-existing key
        obj.$set('c', 1);
        expect(obj.c).toBe(1);
        expect(dep.notify.calls.count()).toBe(3);
        // should ignore deleting non-existing key
        obj.$delete('a');
        expect(dep.notify.calls.count()).toBe(3);
        // should work on non-observed objects
        var obj2 = { a: 1 };
        obj2.$delete('a');
        expect(obj2.hasOwnProperty('a')).toBe(false);
    });

    it('observing array mutations', function () {
        // var arr = [];
        // var ob = new Observer(arr);
        // var dep = new Dep();
        // ob.deps.push(dep);
        // spyOn(dep, 'notify');
        // TODO: I check arr that is not in the first level to observe, need to complete that case.
        const data = { arr: [1, 2, 3] };
        const ob = new Observer(data);
        const dep = data.arr.__ob__.deps[0];
        spyOn(dep, 'notify');

        var objs = [{}, {}, {}];
        data.arr.push(objs[0]);
        data.arr.pop();
        data.arr.unshift(objs[1]);
        data.arr.shift();
        data.arr.splice(0, 0, objs[2]);
        data.arr.sort();
        data.arr.reverse();
        expect(dep.notify.calls.count()).toBe(7);
        // inserted elements should be observed
        objs.forEach(function (obj) {
            expect(obj.__ob__ instanceof Observer).toBe(true);
        });
    });

    it('array $set', function () {
        // var arr = [1];
        // var ob = new Observer(arr);
        // var dep = new Dep();
        // ob.deps.push(dep);
        // spyOn(dep, 'notify');
        // TODO: I check arr that is not in the first level to observe, need to complete that case.
        const data = { arr: [1] };
        const ob = new Observer(data);
        const dep = data.arr.__ob__.deps[0];
        spyOn(dep, 'notify');
        data.arr.$set(0, 2);
        expect(data.arr[0]).toBe(2);
        expect(dep.notify.calls.count()).toBe(1);
        // setting out of bound index
        data.arr.$set(2, 3);
        expect(data.arr[2]).toBe(3);
        expect(dep.notify.calls.count()).toBe(2);
    });
});
