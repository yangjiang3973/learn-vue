const { Aue } = require('./aue');

let vm = new Aue({
    el: '#app',
    data: {
        msg: 'hello',
    },
    render: function render(h) {
        return (
            // <div id="1">
            //     <span>Hello</span>
            //     <div>{this.msg}</div>
            //     <input type="text" vModel={this.msg} placeholder={this.msg} />
            // </div>
            <div
                id="demo"
                style={{ color: 'red', fontSize: '140px' }}
                class={{ foo: true, bar: false }}
            >
                <span>hello</span>
                <input type="checkbox" checked custom="1" class="class-a" />
            </div>
        );
    },
});
