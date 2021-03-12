import { reactive, isReactive, effect, toRaw } from './reactivity/src/index';

// let arr = reactive([]);
// const eventsForPush = [];
// const eventsForUnshift = [];
// console.log('length0: ', arr.length);
// effect(
//     () => {
//         arr.push(1);
//     },
//     {
//         onTrack: (e) => {
//             eventsForPush.push(e);
//         },
//     }
// );
// console.log('length1: ', arr.length);
// console.log('trackPush ', eventsForPush);
// effect(
//     () => {
//         arr.unshift(2);
//     },
//     {
//         onTrack: (e) => {
//             eventsForUnshift.push(e);
//         },
//     }
// );
// console.log('length2: ', arr.length);
// console.log('trackUnshift', eventsForUnshift);

let dummy;
let events = [];
let triggers = [];
const list = reactive(['Hello']);
effect(() => (dummy = list.join(' ')), {
    onTrack: (e) => {
        events.push(e);
    },
    onTrigger: (e) => {
        triggers.push(e);
    },
});
console.log('Hello: ~~~', dummy);
list.push('World!');
console.log('trackPush:', events);
console.log('Hello World!:!!!!~~~~', dummy);
list.shift();
console.log('triggerShift', triggers);
console.log('trackShift:', events);
console.log('World!:~~~~~~', dummy);
