const { Aue } = require('../src/aue');

const MyButton = require('./button');
const ClassComp = require('./classComp');
const FuncComp = require('./funcComp');

let vm = new Aue({
    el: '#app',
    data: {
        msg: 'hello',
        show: true,
    },
    methods: {
        testClick: function testClick() {
            this.msg = 'fuck';
        },
        showSwitch() {
            this.show = !this.show;
        },
    },
    render: function render(h) {
        if (this.show)
            return (
                <div onClick={this.showSwitch}>
                    <span id="1">A</span>
                    <span id="2">B</span>
                    <span id="3">C</span>
                </div>
            );
        else
            return (
                <div onClick={this.showSwitch}>
                    <span id="4">a</span>
                    <span id="5">b</span>
                    <span id="6">c</span>
                    <span id="7">d</span>
                    <span id="8">e</span>
                </div>
            );
    },
});

//<div
//     id="demo"
//     style={{ color: 'red', fontSize: '140px' }}
//     class={{ foo: true, bar: false }}
//     vOn:click={this.testClick}
// >
//     fefafe
// </div>

//<input
//     onClick={this.testClick}
//     type="checkbox"
//     checked
//     custom1="1"
//     class="class-a"
// />

// <div id="1">
//     <span>Hello</span>
//     <div>{this.msg}</div>
//     <input type="text" vModel={this.msg} placeholder={this.msg} />
// </div>
// <div
//     id="demo"
//     style={{ color: 'red', fontSize: '140px' }}
//     class={{ foo: true, bar: false }}
// >
//     <span>hello</span>
// </div>
