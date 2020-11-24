const { Watcher } = require('../../src/watcher');
const { Aue } = require('../../src/aue');
const { nextTick } = require('../../src/utils');

describe('watcher', function () {
    let vm, spy;
    beforeEach(function () {
        vm = new Aue({
            filters: {},
            data: {
                a: 1,
                b: {
                    c: 2,
                    d: 4,
                },
                c: 'c',
                msg: 'yo',
            },
        });
        spy = jasmine.createSpy('watcher'); // is spy a cb of watcher?
    });

    it('simple path', function (done) {
        var watcher = new Watcher(vm, 'b.c', spy);
        expect(watcher.value).toBe(2);
        vm.b.c = 3;
        nextTick(function () {
            expect(watcher.value).toBe(3);
            expect(spy).toHaveBeenCalledWith(3, 2);
            vm.b = { c: 4 }; // swapping the object
            nextTick(function () {
                expect(watcher.value).toBe(4);
                expect(spy).toHaveBeenCalledWith(4, 3);
                done();
            });
        });
    });

    it('bracket access path', function (done) {
        var watcher = new Watcher(vm, 'b["c"]', spy);
        expect(watcher.value).toBe(2);
        vm.b.c = 3;
        nextTick(function () {
            expect(watcher.value).toBe(3);
            expect(spy).toHaveBeenCalledWith(3, 2);
            vm.b = { c: 4 }; // swapping the object
            nextTick(function () {
                expect(watcher.value).toBe(4);
                expect(spy).toHaveBeenCalledWith(4, 3);
                done();
            });
        });
    });

    it('dynamic path', function (done) {
        var watcher = new Watcher(vm, 'b[c]', spy);
        expect(watcher.value).toBe(2);
        vm.b.c = 3;
        nextTick(function () {
            expect(watcher.value).toBe(3);
            expect(spy).toHaveBeenCalledWith(3, 2);
            vm.c = 'd'; // changing the dynamic segment in path
            nextTick(function () {
                expect(watcher.value).toBe(4);
                expect(spy).toHaveBeenCalledWith(4, 3);
                done();
            });
        });
    });
});
