//Vue.extend, so this points to Vue class

module.exports.initExtend = function initExtend(Aue) {
    Aue.extend = extend(extendOptions) {
        Sub = function AueComponent(options) {
            this._init(options);
        };
    
        Sub.prototype = Object.create(this.prototype);
        Sub.prototype.constructor = Sub;
        // Sub has Super's static options(Aue.options)! not options passed by consumers
        Sub.options = { ...extendOptions, ...Aue.options };
        Sub['super'] = this;
        // allow further extension
        Sub.extend = Super.extend;
    
        return Sub;
    };
}

// new Sub(options);

// Vue.extend({
//     props: ['addTodo', 'todos'],
//     data() {
//         return {
//             title: 'Todo App',
//         };
//     },
//     methods: {
//         inputTodo: function (e) {
//             if (e.code === 'Enter' && e.target.value) {
//                 this.addTodo(e.target.value);
//                 e.target.value = '';
//             }
//         },
//     },
//     render() {
//         return (
//             <header class="header">
//                 <h1>{this.title}</h1>
//                 <input
//                     class="new-todo"
//                     autofocus
//                     autocomplete="off"
//                     type="text"
//                     placeholder="What needs to be done?"
//                     onKeyup={this.inputTodo}
//                 />
//             </header>
//         );
//     },
// });
