const { Aue } = require('./aue');
const { Observer } = require('./observer/observer');
const { Dep } = require('./dep');

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
        observeData: {
            a: 1,
            b: 2,
        },
        simpleArr: [1, 2, 3, 4, 5],
        nestedArr: [1, [2, 3, 4], 5],
        objArr: [{ a: 1 }, { b: 2 }, { c: 3 }],
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
        addData: function () {
            // this.observeData.temp = true;
            this.$add('temp', 'this is temp'); // this means each obj's key will inherit methods from vm?
            this.$add('c', 'this is c');
        },
        deleteData: function () {
            this.$delete('c');
        },
        changeSimpleArr: function () {
            // this.simpleArr.push(100); //(DONE)
            // this.simpleArr.$set('0', 100); //(DONE)
            // this.simpleArr[0] = 100; // NOTE: this also works...(DONE)
            // this.simpleArr.$set(10, 100);
            this.simpleArr.splice(1, 1);
        },
        changeNestedArr: function () {
            // nestedArr: [1, [2, 3, 4], 5],
            // this.nestedArr.push(100); //(DONE)
            // this.nestedArr[1].push(100); // NOTE: this also work(DONE)
        },
        changeObjArr: function () {
            //objArr: [{ a: 1 }, { b: 2 }, { c: 3 }],
            this.objArr[0].a = 100;
            this.objArr.push(1);
            console.log('this.objArr', this.objArr);
        },
        batchUpdate: function () {
            for (let i = 0; i < 1e3; i++) {
                if (i % 2 === 0) this.intro = '';
                else this.intro = 'updated intro';
            }
            console.log('done');
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
