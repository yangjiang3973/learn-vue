// const { Observer } = require('./observer');

// var callback = function (newVal, oldVal) {
//     alert(`the old value: ${oldVal}, changed to newVal: ${newVal}`);
// };

// var data = {
//     a: 200,
//     level1: {
//         b: 'str',
//         c: [1, 2, 3],
//         level2: {
//             d: 90,
//         },
//         d: { dd: 1 },
//     },
// };

// var arrTest1 = [1, 2, 3, 4];
// var arrTest2 = [1, 2, 3, [10, 11, 12]];
// var arrTest3 = { a: 200, b: [1, 2, 3], c: 'ccc' };

// var j = new Observer(data, callback);

// var j = new Observer(arrTest1, callback);
// var k = new Observer(arrTest2, callback);
// var i = new Observer(arrTest3, callback);

// data.a = 250;
// data.level1.b = 'sss';
// data.level1.level2.d = 'msn';
// data.level1.d = { aa: 2 };
// data.level1.c.push(4);

// arrTest1.push(100);
// arrTest1[0] = 99;
// arrTest1[4] = 101;
// console.log('arrTest1', arrTest1);

// arrTest2[3].push(13);
// console.log(arrTest2);

// arrTest3.b.push(4);
// console.log('arrTest3', arrTest3);

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
