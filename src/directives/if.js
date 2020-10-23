const compile = require('../compile/compile'); // BUG: circle require..
const directives = require('./index');
const { Directive } = require('../directive');
const _ = require('../utils');

module.exports.bind = function () {
    const start = document.createComment('v-if-start');
    const end = document.createComment('v-if-end');
    // replace on dom tree
    this.elParent = this.el.parentNode;
    this.elParent.removeChild(this.el);
    this.elParent.appendChild(start);
    this.elParent.appendChild(end);

    // compile sub tree
    this.template = document.createDocumentFragment();
    this.template.appendChild(this.el.cloneNode(true));

    this.links = compile(this.template, directives);
    console.log('module.exports.bind -> links', this.links);
};

module.exports.update = function (value) {
    if (value) {
        this.elParent.appendChild(this.template);
        this.links.forEach((link) => {
            const { node, dirs } = link;
            if (!dirs) return;
            dirs.forEach((dir) => {
                const { name, def, descriptors } = dir;
                // vm._bindDir(node, dir);
                descriptors.forEach((desc) => {
                    this.vm._directives.push(
                        new Directive(name, node, this.vm, desc, def) //* `host` is not passed yet
                    );
                });
            });
        });
    }
};
