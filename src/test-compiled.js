'use strict';

var _babelHelperVueJsxMergeProps = _interopRequireDefault(
    require('@vue/babel-helper-vue-jsx-merge-props')
);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

new Vue({
    el: '#demo',
    render: function render(h) {
        var _this = this;

        return h(
            'div',
            {
                attrs: {
                    id: '1',
                },
            },
            [
                h('span', ['Hello']),
                h('span', ['world!']),
                h('div', [this.msg]),
                h(
                    'input',
                    (0, _babelHelperVueJsxMergeProps['default'])([
                        {
                            on: {
                                input: function input($event) {
                                    if ($event.target.composing) return;
                                    _this.msg = $event.target.value;
                                },
                            },
                            attrs: {
                                type: 'text',
                            },
                            domProps: {
                                value: _this.msg,
                            },
                        },
                        {
                            directives: [
                                {
                                    name: 'model',
                                    value: _this.msg,
                                    modifiers: {},
                                },
                            ],
                        },
                    ])
                ),
            ]
        );
    },
});
