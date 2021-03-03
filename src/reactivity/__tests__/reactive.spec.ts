// import { ref, isRef } from '../src/ref';
// import { reactive, isReactive, toRaw, markRaw } from '../src/reactive';
// import { computed } from '../src/computed';
// import { effect } from '../src/effect';
import { sum } from '../sum';

describe('reactivity/reactive', () => {
    test('Object', () => {
        expect(sum(1, 2)).toBe(3);
    });
});
