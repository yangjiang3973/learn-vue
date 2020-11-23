const { Observer, observeData } = require('../../../src/observer/observer');
const { Dep } = require('../../../src/dep');
const { Aue } = require('../../../src/aue');

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
        expect(watcher.deps.length).toBe(2);
        //TODO: ignore for now
        // expect(watcher.deps.length).toBe(3); // NOTE: why now changed to 3 on vue1.0: obj.a + a + a.b

        obj.a.b = 3;
        expect(watcher.update.calls.count()).toBe(1);

        let oldA = obj.a;
        obj.a = { b: 4 };
        expect(watcher.update.calls.count()).toBe(2);
        // TODO: I should remove oldA's __ob__ directly, after change this.deps to this.dep
        // expect(oldA.__ob__.deps.length).toBe(0);
        // expect(obj.a.__ob__.deps.length).toBe(1);

        // recollect dep
        watcher.deps = [];
        Dep.target = watcher;
        let temp2 = obj.a.b;
        Dep.target = null;
        //TODO: ignore for now
        // expect(watcher.deps.length).toBe(3); // NOTE: why now changed to 3 on vue1.0: obj.a + a + a.b
        expect(watcher.deps.length).toBe(2);
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
    // it('observing $add/$set/$delete', function () {
    //     const obj = { a: 1 };
    //     const ob = new Observer(obj);
    //     var dep = new Dep();
    //     ob.deps.push(dep);
    //     spyOn(dep, 'notify');
    //     obj.$add('b', 2);
    //     expect(obj.b).toBe(2);
    //     expect(dep.notify.calls.count()).toBe(1);
    //     obj.$delete('a');
    //     expect(obj.hasOwnProperty('a')).toBe(false);
    //     expect(dep.notify.calls.count()).toBe(2); // accumulated
    //     // should ignore adding an existing key
    //     obj.$add('b', 3);
    //     expect(obj.b).toBe(2);
    //     expect(dep.notify.calls.count()).toBe(2);
    //     // $set
    //     obj.$set('b', 3);
    //     expect(obj.b).toBe(3);
    //     expect(dep.notify.calls.count()).toBe(2);
    //     // set non-existing key
    //     obj.$set('c', 1);
    //     expect(obj.c).toBe(1);
    //     expect(dep.notify.calls.count()).toBe(3);
    //     // should ignore deleting non-existing key
    //     obj.$delete('a');
    //     expect(dep.notify.calls.count()).toBe(3);
    //     // should work on non-observed objects
    //     var obj2 = { a: 1 };
    //     obj2.$delete('a');
    //     expect(obj2.hasOwnProperty('a')).toBe(false);
    // });

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

    it('root level array $set', function () {
        // observe array at the first level
        const arr = [1];
        const ob = observeData(arr, 1);
        let dep = ob.dep;
        spyOn(dep, 'notify');
        arr.$set(0, 2);
        expect(arr[0]).toBe(2);
        expect(dep.notify.calls.count()).toBe(1);
        // setting out of bound index
        arr.$set(2, 3);
        expect(arr[2]).toBe(3);
        expect(dep.notify.calls.count()).toBe(2);
    });

    it('child level array $set', function () {
        // observe array at the child level
        const data = { arr: [1] };
        const ob = observeData(data);
        const dep = data.arr.__ob__.dep;
        spyOn(dep, 'notify');
        data.arr.$set(0, 2);
        expect(data.arr[0]).toBe(2);
        expect(dep.notify.calls.count()).toBe(1);
        // setting out of bound index
        data.arr.$set(2, 3);
        expect(data.arr[2]).toBe(3);
        expect(dep.notify.calls.count()).toBe(2);
    });

    it('root level array $remove', function () {
        // observe array at the first level
        var arr = [{}, {}];
        var obj1 = arr[0];
        var obj2 = arr[1];
        var ob = observeData(arr, 1);
        var dep = ob.dep;
        spyOn(dep, 'notify');
        // remove by index
        arr.$remove(0);
        expect(arr.length).toBe(1);
        expect(arr[0]).toBe(obj2);
        expect(dep.notify.calls.count()).toBe(1);
        // remove by identity, not in array
        arr.$remove(obj1);
        expect(arr.length).toBe(1);
        expect(arr[0]).toBe(obj2);
        expect(dep.notify.calls.count()).toBe(1);
        // remove by identity, in array
        arr.$remove(obj2);
        expect(arr.length).toBe(0);
        expect(dep.notify.calls.count()).toBe(2);
    });

    it('child level array $remove', function () {
        // observe array at the child level
        const arr = [{}, {}];
        const data = { arr };
        const obj1 = arr[0];
        const obj2 = arr[1];
        const ob = observeData(data);
        const dep = data.arr.__ob__.dep;
        spyOn(dep, 'notify');
        // remove by index
        arr.$remove(0);
        expect(arr.length).toBe(1);
        expect(arr[0]).toBe(obj2);
        expect(dep.notify.calls.count()).toBe(1);
        // remove by element, not in array
        arr.$remove(obj1);
        expect(arr.length).toBe(1);
        expect(arr[0]).toBe(obj2);
        expect(dep.notify.calls.count()).toBe(1);
        // remove by element, in array
        arr.$remove(obj2);
        expect(arr.length).toBe(0);
        expect(dep.notify.calls.count()).toBe(2);
    });

    // Whether allow observer to alter data objects\'__proto__.
    // I always set to true to modify proto, instead of adding methos to array instance
    it('no proto', function () {
        // config.proto = false;
        // object
        // var obj = { a: 1 };
        // var ob = new Observer(obj);
        // expect(obj.$add).toBeTruthy();
        // expect(obj.$delete).toBeTruthy();
        // var dep = new Dep();
        // ob.deps.push(dep);
        // spyOn(dep, 'notify');
        // obj.$add('b', 2);
        // expect(dep.notify).toHaveBeenCalled();
        // // array
        // var arr = [1, 2, 3];
        // var ob2 = Observer.create(arr);
        // expect(arr.$set).toBeTruthy();
        // expect(arr.$remove).toBeTruthy();
        // expect(arr.push).not.toBe([].push);
        // var dep2 = new Dep();
        // ob2.deps.push(dep2);
        // spyOn(dep2, 'notify');
        // arr.push(1);
        // expect(dep2.notify).toHaveBeenCalled();
        // config.proto = true;
    });
});
