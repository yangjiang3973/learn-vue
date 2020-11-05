const { Directive } = require('./directive');
const { transclude } = require('./compile/transclude');
const compile = require('./compile/compile');
const _ = require('./utils');

class Compiler {
    constructor(el, vm) {
        // 3 stages: transclude, compile and link
        // this.$vm = vm;
        this.$el = _.isElementNode(el) ? el : document.querySelector(el);
        // this.vm = vm;
        // transclude: convert template string to dom and append to el
        transclude(this.$el, vm.options.template);
        //compile
        const links = compile(this.$el, vm);
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
    }
}

module.exports.Compiler = Compiler;
