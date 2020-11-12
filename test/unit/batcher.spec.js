const batcher = require('../../src/batcher');
const { nextTick } = require('../../src/utils');

describe('Batcher', function () {
    let spy;
    beforeEach(function () {
        spy = jasmine.createSpy("spy on watcher's run()");
        // TODO: implement this warn
        // spyOn(_, 'warn')
    });
    it('push', function (done) {
        batcher.push({
            run: spy,
        });
        nextTick(function () {
            expect(spy.calls.count()).toBe(1);
            done();
        });
    });

    // remove duplicate
    it('dedup', function (done) {
        batcher.push({
            id: 1,
            run: spy,
        });
        batcher.push({
            id: 1,
            run: spy,
        });
        nextTick(function () {
            expect(spy.calls.count()).toBe(1);
            done();
        });
    });

    it('allow diplicate when flushing', function (done) {
        batcher.push({
            id: 1,
            run: function () {
                spy();
                // update another watcher, when will happen？
                batcher.push({
                    id: 1,
                    run: spy,
                });
            },
        });
        nextTick(function () {
            expect(spy.calls.count()).toBe(2);
            done();
        });
    });

    it('calls user watchers after directive updates', function (done) {
        var vals = [];
        function run() {
            vals.push(this.id);
        }
        batcher.push({
            id: 2,
            user: true,
            run: function () {
                run.call(this);
                // user watcher triggering another directive update!
                batcher.push({
                    id: 3,
                    run: run,
                });
            },
        });
        batcher.push({
            id: 1,
            run: run,
        });
        nextTick(function () {
            // expect(vals[0]).toBe(1);
            // expect(vals[1]).toBe(2);
            // expect(vals[2]).toBe(3);
            done();
        });
    });
});
