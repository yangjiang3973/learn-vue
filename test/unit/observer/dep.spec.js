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

    // TODO:
    // it('removeSub', function(){

    // })

    it('notify', function () {
        const sub = {
            update: jasmine.createSpy('sub'),
        };
        d.addSub(sub);
        d.notify();
        expect(sub.update).toHaveBeenCalled();
    });
});
