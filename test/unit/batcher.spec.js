import { queueWatcher } from '../../src/batcher';
import config from '../../src/config';
import * as _ from '../../src/utils';
import { nextTick } from '../../src/utils';

describe('Batcher', function () {
    let spy;
    beforeEach(function () {
        spy = jasmine.createSpy("spy on watcher's run()");
    });
    it('pushWatcher', function (done) {
        queueWatcher({
            run: spy,
        });
        nextTick(function () {
            expect(spy.calls.count()).toBe(1);
            done();
        });
    });

    // remove duplicate
    it('dedup', function (done) {
        queueWatcher({
            id: 1,
            run: spy,
        });
        queueWatcher({
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
        queueWatcher(job);
        queueWatcher({
            id: 2,
            run: function () {
                queueWatcher(job);
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
        queueWatcher({
            id: 2,
            user: true,
            run: function () {
                run.call(this);
                // user watcher triggering another directive update!
                queueWatcher({
                    id: 3,
                    run: run,
                });
            },
        });
        queueWatcher({
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
                queueWatcher(watcher);
            },
        };
        queueWatcher(watcher);
        nextTick(function () {
            expect(count).not.toBe(0);
            expect(count).toBe(config._maxUpdateCount + 1);
            expect(warn).toHaveBeenCalled();
            // expect('infinite update loop').toHaveBeenWarned();
            done();
        });
    });

    it('should call newly pushed watcher after current watcher is done', function (done) {
        var callOrder = [];
        queueWatcher({
            id: 1,
            user: true,
            run: function () {
                callOrder.push(1);
                queueWatcher({
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
