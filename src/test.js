new Vue({
    el: '#demo',
    render: function (h) {
        return (
            <div id="1">
                <span>Hello</span>
                <span>world!</span>
                <div>{this.msg}</div>
                <input type="text" vModel={this.msg} />
            </div>
        );
    },
});
