import { reactive, isReactive, effect, toRaw } from './reactivity/src/index';

const counter = reactive({ num: 0 });

effect(() => counter.num++);
counter.num = 4;
