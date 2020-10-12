const { hello } = require('../../src/test');

describe('A test suite for hello', function () {
    it('Spec test 1, test the returned mesg', function () {
        const mesg = hello();
        expect(mesg).toEqual('hello');
    });
});
