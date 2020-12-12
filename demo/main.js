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
        if (this.show) {
            return (
                <div
                    onClick={this.showSwitch}
                    style={{
                        width: '100px',
                        height: '100px',
                        backgroundColor: 'red',
                    }}
                    id="test"
                >
                    <span>hellp</span>
                </div>
            );
        } else {
            // return <div onClick={this.showSwitch}>fuck</div>;
            return <div>fuck</div>;
        }
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
