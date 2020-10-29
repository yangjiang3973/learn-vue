const { Watcher } = require('./watcher');
const { Dep } = require('./dep');
const { Directive } = require('./directive');
const directives = require('./directives/index'); //NOTE: can i remove /index
const compile = require('./compile/compile');
const _ = require('./utils');

class Compiler {
    constructor(el, vm) {
        // 3 stages: transclude, compile and link
        // this.$vm = vm;
        this.$el = _.isElementNode(el) ? el : document.querySelector(el);

        //TODO:transclude
        //compile
        const links = compile(this.$el, directives);
        // link
        links.forEach((link) => {
            const { node, dirs } = link;
            if (!dirs) return;
            dirs.forEach((dir) => {
                const { name, def, descriptors } = dir;
                descriptors.forEach((desc) => {
                    // NOTE: why a dir has multiple descriptors?
                    vm._directives.push(
                        new Directive(name, node, vm, desc, def) //* `host` is not passed yet
                    );
                });
            });
        });
        // linkStage();
        // this.$fragment = this.node2Fragment(this.$el);
        // this.init();
        // this.$el.appendChild(this.$fragment);
    }

    // node2Fragment(el) {
    //     var fragment = document.createDocumentFragment(),
    //         child;
    //     while ((child = el.firstChild)) {
    //         fragment.appendChild(child);
    //     }

    //     return fragment;
    // }
    // init() {
    //     this.compileElement(this.$fragment);
    // }
}

module.exports.Compiler = Compiler;
