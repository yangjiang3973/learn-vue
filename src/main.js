const { Aue } = require('./aue');

Aue.directive('demo', {
    bind: function () {
        this.el.style.color = '#fff';
        this.el.style.backgroundColor = this.arg;
    },
    update: function (value) {
        this.el.innerHTML =
            'name - ' +
            this.name +
            '<br>' +
            'raw - ' +
            this.raw +
            '<br>' +
            'expression - ' +
            this.expression +
            '<br>' +
            'argument - ' +
            this.arg +
            '<br>' +
            'value - ' +
            value;
    },
});

Aue.filter('reverse', function (value) {
    return value.split('').reverse().join('');
});

let MyComponent = Aue.extend({
    template: `
                <p>A custom component!</p>
                `,
});

Aue.component('my-component', MyComponent);

let vm = new Aue({
    el: '#app',
    data: {
        title: 'learn vue',
        intro: 'Version 0.11',
        // intro: 'AAAAA',
        word: 'Hello World!',
        flag: true,
        // list: ['a', 'b', 'c', 'd'],
        showEl: true,
        firstName: 'Yang',
        lastName: 'Jiang',
    },
    computed: {
        // fullName: {
        //     // the getter should return the desired value
        //     get: function () {
        //         return this.firstName + ' ' + this.lastName;
        //     },
        //     // the setter is optional
        //     set: function (newValue) {
        //         var names = newValue.split(' ');
        //         this.firstName = names[0];
        //         this.lastName = names[names.length - 1];
        //     },
        // },
        fullName: function () {
            return this.firstName + ' ' + this.lastName;
        },
    },
    methods: {
        changeWord: function () {
            this.word = 'fuck world';
        },
        changeFlag: function () {
            this.flag = !this.flag;
        },
        changeShow: function () {
            this.showEl = !this.showEl;
        },
        changeFirstName: function () {
            this.firstName = 'Dan';
        },
        changeLastName: function () {
            this.lastName = 'Gao';
        },
    },
});

// setTimeout(() => {
//     vm.firstName = 'Dan';
//     vm.lastName = 'Gao!';
// }, 2000);

// const vm = new Aue({
//     el: '#app',
//     template: `<h1>
//                     test template
//                 </h1>
//                 <div>{{ firstName }}</div>
//                 <button>click</button>
//                 `,
//     data: {
//         firstName: 'Yang',
//     },
// });
