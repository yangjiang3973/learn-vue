const { Watcher } = require('./watcher');
const { Dep } = require('./dep');
const { Directive } = require('./directive');
const compile = require('./compile/compile');
const _ = require('./utils');

class Compiler {
    constructor(el, vm) {
        // 3 stages: transclude, compile and link
        // this.$vm = vm;
        this.$el = _.isElementNode(el) ? el : document.querySelector(el);
        // this.vm = vm;
        //TODO:transclude
        //compile
        const links = compile(this.$el, vm);
        // link
        links.forEach((link) => {
            const { node, dirs } = link;
            if (!dirs) return;
            console.log(dirs);
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
