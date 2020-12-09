const { Aue } = require('./aue');

let vm = new Aue({
    el: '#app',
    data: {
        msg: 'hello',
    },
    render: function render(h) {
        return (
            <div id="1">
                <div>fuck</div>
                bitch
                <span>Hello</span>
                <span>world!</span>
                <div>dawdwadw</div>
            </div>
        );
    },
});
