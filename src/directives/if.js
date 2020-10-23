const compile = require('../compile/compile'); // BUG: circle require..
const _ = require('../utils');

module.exports.bind = function () {
    const start = document.createComment('v-if-start');
    const end = document.createComment('v-if-end');
    // replace on dom tree
    const parent = this.el.parentNode;
    parent.removeChild(this.el);
    parent.appendChild(start);
    parent.appendChild(end);

    // compile sub tree
    const template = document.createDocumentFragment();
    template.appendChild(this.el.cloneNode(true));

    console.log('module.exports.bind -> compile', compile);
    const link = compile(template);
    console.log('module.exports.bind -> link', link);
};

module.exports.update = function (value) {};
