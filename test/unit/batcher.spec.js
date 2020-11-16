const batcher = require('../../src/batcher');
const config = require('../../src/config');
const { nextTick } = require('../../src/utils');
const _ = require('../../src/utils');

describe('Batcher', function () {
    let spy;
    beforeEach(function () {
        spy = jasmine.createSpy("spy on watcher's run()");
    });
    it('pushWatcher', function (done) {
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

    //* NOTE: why allow duplicate when flushing?
    //* this is from vue 1.0
    it('allow diplicate when flushing', function (done) {
        var job = {
            id: 1,
            run: spy,
        };
        batcher.push(job);
        batcher.push({
            id: 2,
            run: function () {
                batcher.push(job);
            },
        });
        nextTick(function () {
            expect(spy.calls.count()).toBe(2);
            done();
        });
    });

    it('calls user watchers(with another directive update) after first directive updates', function (done) {
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
            expect(vals[0]).toBe(1);
            expect(vals[1]).toBe(2);
            expect(vals[2]).toBe(3);
            done();
        });
    });

    it('warn against infinite update loops', function (done) {
        spyOn(_, 'warn');
        var count = 0;
        // update itself in run to mock a update cycle
        var watcher = {
            id: 1,
            run: function () {
                count++;
                batcher.push(watcher);
            },
        };
        batcher.push(watcher);
        nextTick(function () {
            expect(count).not.toBe(0);
            expect(count).toBe(config._maxUpdateCount + 1);
            expect(_.warn).toHaveBeenCalled();
            // expect('infinite update loop').toHaveBeenWarned();
            done();
        });
    });

    it('should call newly pushed watcher after current watcher is done', function (done) {
        var callOrder = [];
        batcher.push({
            id: 1,
            user: true,
            run: function () {
                callOrder.push(1);
                batcher.push({
                    id: 2,
                    run: function () {
                        callOrder.push(3);
                    },
                });
                callOrder.push(2);
            },
        });
        nextTick(function () {
            expect(callOrder.join()).toBe('1,2,3');
            done();
        });
    });
});
