import Aue from '../../../src/aue';
import observeData, { Observer } from '../../../src/observer/observer';
import Dep from '../../../src/dep';
import { hasOwn } from '../../../src/utils';

describe('Observer', function () {
    it('create on non-observables', function () {
        // skip primitive value
        var ob = observeData(1);
        expect(ob).toBeUndefined();
        // avoid vue instance
        ob = observeData(new Aue());
        expect(ob).toBeUndefined();
        // avoid frozen objects
        ob = observeData(Object.freeze({}));
        expect(ob).toBeUndefined();
    });

    it('create an object', function () {
        const obj = {
            a: {},
            b: {},
        };
        const obInstance = observeData(obj);
        expect(obInstance instanceof Observer).toBe(true);
        expect(obInstance.value).toBe(obj);
        expect(obj.__ob__).toBe(obInstance);

        // should also observe children
        expect(obj.a.__ob__ instanceof Observer).toBe(true);
        expect(obj.b.__ob__ instanceof Observer).toBe(true);

        // should return existing ob on already observed objects
        var ob2 = observeData(obj);
        expect(ob2).toBe(obInstance);
    });

    it('create on null', function () {
        // on null
        var obj = Object.create(null);
        obj.a = {};
        obj.b = {};
        var ob = observeData(obj);
        expect(ob instanceof Observer).toBe(true);
        expect(ob.value).toBe(obj);
        expect(obj.__ob__).toBe(ob);
        // should've walked children
        expect(obj.a.__ob__ instanceof Observer).toBe(true);
        expect(obj.b.__ob__ instanceof Observer).toBe(true);
        // should return existing ob on already observed objects
        var ob2 = observeData(obj);
        expect(ob2).toBe(ob);
    });

    it('create on already observed object(defined getter and setter)', function () {
        // on object
        var obj = {};
        var val = 0;
        var getCount = 0;
        Object.defineProperty(obj, 'a', {
            configurable: true,
            enumerable: true,
            get: function () {
                getCount++;
                return val;
            },
            set: function (v) {
                val = v;
            },
        });

        var ob = observeData(obj);
        expect(ob instanceof Observer).toBe(true);
        expect(ob.value).toBe(obj);
        expect(obj.__ob__).toBe(ob);

        getCount = 0;
        // Each read of 'a' should result in only one get underlying get call
        obj.a;
        expect(getCount).toBe(1);
        obj.a;
        expect(getCount).toBe(2);

        // should return existing ob on already observed objects
        var ob2 = observeData(obj);
        expect(ob2).toBe(ob);

        // // should call underlying setter
        obj.a = 10;
        expect(val).toBe(10);
    });

    it('create on property with only getter', function () {
        // on object
        var obj = {};
        Object.defineProperty(obj, 'a', {
            configurable: true,
            enumerable: true,
            get: function () {
                return 123;
            },
        });

        var ob = observeData(obj);
        expect(ob instanceof Observer).toBe(true);
        expect(ob.value).toBe(obj);
        expect(obj.__ob__).toBe(ob);

        // should be able to read
        expect(obj.a).toBe(123);

        // should return existing ob on already observed objects
        var ob2 = observeData(obj);
        expect(ob2).toBe(ob);

        // since there is no setter, you shouldn't be able to write to it
        // PhantomJS throws when a property with no setter is set
        // but other real browsers don't
        try {
            obj.a = 101;
        } catch (e) {}
        expect(obj.a).toBe(123);
    });

    it('create on property with only setter', function () {
        // on object
        var obj = {};
        var val = 10;
        Object.defineProperty(obj, 'a', {
            // eslint-disable-line accessor-pairs
            configurable: true,
            enumerable: true,
            set: function (v) {
                val = v;
            },
        });

        var ob = observeData(obj);
        expect(ob instanceof Observer).toBe(true);
        expect(ob.value).toBe(obj);
        expect(obj.__ob__).toBe(ob);

        // reads should return undefined
        expect(obj.a).toBe(undefined);

        // should return existing ob on already observed objects
        var ob2 = observeData(obj);
        expect(ob2).toBe(ob);

        // writes should call the set function
        obj.a = 100;
        expect(val).toBe(100);
    });

    it('create on property which is marked not configurable', function () {
        // on object
        var obj = {};
        Object.defineProperty(obj, 'a', {
            configurable: false,
            enumerable: true,
            val: 10,
        });

        var ob = observeData(obj);
        expect(ob instanceof Observer).toBe(true);
        expect(ob.value).toBe(obj);
        expect(obj.__ob__).toBe(ob);
    });

    it('create on array of objs', function () {
        // on object
        var arr = [{}, {}];
        var ob = observeData(arr);
        expect(ob instanceof Observer).toBe(true);
        expect(ob.value).toBe(arr);
        expect(arr.__ob__).toBe(ob);
        // should walk children
        expect(arr[0].__ob__ instanceof Observer).toBe(true);
        expect(arr[1].__ob__ instanceof Observer).toBe(true);
    });

    it('observing object prop change', function () {
        const obj = {
            a: {
                b: 2,
            },
        };
        const obInstance = observeData(obj);
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
        // NOTE: after follow vue's way, each observer has a dep to call depend: obj.a + a + a.b
        expect(watcher.deps.length).toBe(3);
        // expect(watcher.deps.length).toBe(2);

        obj.a.b = 3;
        expect(watcher.update.calls.count()).toBe(1);

        let oldA = obj.a;
        obj.a = { b: 4 };
        expect(watcher.update.calls.count()).toBe(2);
        // TODO: should I remove oldA's __ob__ directly? after change this.deps to this.dep
        // expect(oldA.__ob__.deps.length).toBe(0);
        // expect(obj.a.__ob__.deps.length).toBe(1);

        // recollect dep
        watcher.deps = [];
        Dep.target = watcher;
        let temp2 = obj.a.b;
        Dep.target = null;
        expect(watcher.deps.length).toBe(3); // NOTE: why now changed to 3 on vue1.0: obj.a + a(observer instance) + a.b
        // expect(watcher.deps.length).toBe(2);
        // set on the swapped object
        obj.a.b = 5;
        expect(watcher.update.calls.count()).toBe(3);
    });

    it('observing object prop change on defined property', function () {
        var obj = { val: 2 };
        Object.defineProperty(obj, 'a', {
            configurable: true,
            enumerable: true,
            get: function () {
                return this.val;
            },
            set: function (v) {
                this.val = v;
                return this.val;
            },
        });

        observeData(obj);
        // mock a watcher!
        var watcher = {
            deps: [],
            addDep: function (dep) {
                this.deps.push(dep);
                dep.addSub(this);
            },
            update: jasmine.createSpy(),
        };
        // collect dep
        Dep.target = watcher;
        expect(obj.a).toBe(2); // Make sure 'this' is preserved
        Dep.target = null;
        obj.a = 3;
        expect(obj.val).toBe(3); // make sure 'setter' was called
        obj.val = 5;
        expect(obj.a).toBe(5); // make sure 'getter' was called
    });

    // (TODO)
    it('observing set/delete', function () {
        const obj1 = { a: 1 };
        const ob1 = observeData(obj1);
        const dep1 = ob1.dep;
        spyOn(dep1, 'notify');
        Aue.set(obj1, 'b', 2);
        expect(obj1.b).toBe(2);
        expect(dep1.notify.calls.count()).toBe(1);
        Aue.delete(obj1, 'a');
        expect(hasOwn(obj1, 'a')).toBe(false);
        expect(dep1.notify.calls.count()).toBe(2);
        // set existing key, should be a plain set and not
        // trigger own ob's notify
        Aue.set(obj1, 'b', 3);
        expect(obj1.b).toBe(3);
        expect(dep1.notify.calls.count()).toBe(2);
        // set non-existing key
        Aue.set(obj1, 'c', 1);
        expect(obj1.c).toBe(1);
        expect(dep1.notify.calls.count()).toBe(3);
        // should ignore deleting non-existing key
        Aue.delete(obj1, 'a');
        expect(dep1.notify.calls.count()).toBe(3);
        // should work on non-observed objects
        const obj2 = { a: 1 };
        Aue.delete(obj2, 'a');
        expect(hasOwn(obj2, 'a')).toBe(false);
        // should work on Object.create(null)
        const obj3 = Object.create(null);
        obj3.a = 1;
        const ob3 = observeData(obj3);
        const dep3 = ob3.dep;
        spyOn(dep3, 'notify');
        Aue.set(obj3, 'b', 2);
        expect(obj3.b).toBe(2);
        expect(dep3.notify.calls.count()).toBe(1);
        Aue.delete(obj3, 'a');
        expect(hasOwn(obj3, 'a')).toBe(false);
        expect(dep3.notify.calls.count()).toBe(2);
    });

    it('observing root level array mutations', function () {
        const arr = [];
        const ob = observeData(arr);
        let dep = ob.dep;
        spyOn(dep, 'notify');
        var objs = [{}, {}, {}];
        arr.push(objs[0]);
        arr.pop();
        arr.unshift(objs[1]);
        arr.shift();
        arr.splice(0, 0, objs[2]);
        arr.sort();
        arr.reverse();
        expect(dep.notify.calls.count()).toBe(7);
        // inserted elements should be observed
        objs.forEach(function (obj) {
            expect(obj.__ob__ instanceof Observer).toBe(true);
        });
    });

    it('observing child level array mutations', function () {
        // observe array at the child level
        const data = { arr: [1, 2, 3] };
        const ob = observeData(data);
        const dep = data.arr.__ob__.dep;
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
});
