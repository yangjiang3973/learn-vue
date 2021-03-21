import { createApp, h } from './runtime-dom/src/index';
const app = createApp({
    data() {
        return {
            counter: 0,
        };
    },
    render() {
        // setTimeout(() => {
        //     this.counter++;
        // }, 1000);
        // <div>
        //     <span>“Hello world!”</span>
        // </div>
        // equivalence vnode:
        return h('div', null, [h('span', null, ['Counter: ' + this.counter])]);
    },
});
app.mount('#app');
