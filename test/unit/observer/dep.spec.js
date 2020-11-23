const { Dep } = require('../../../src/dep');

describe('Dep', function () {
    let d;
    beforeEach(function () {
        d = new Dep();
    });

    it('addSub', function () {
        let sub = {};
        d.addSub(sub);
        expect(d.subs.length).toBe(1);
        expect(d.subs.indexOf(sub)).toBe(0);
    });

    it('removeSub', function () {
        var sub = {};
        d.addSub(sub);
        d.removeSub(sub);
        expect(d.subs.length).toBe(0);
        expect(d.subs.indexOf(sub)).toBe(-1);
    });

    it('notify', function () {
        const sub = {
            update: jasmine.createSpy('sub'),
        };
        d.addSub(sub);
        d.notify();
        expect(sub.update).toHaveBeenCalled();
    });
});
