const { Watcher } = require('./watcher');
const { Dep } = require('./dep');
const { compile } = require('./compile/compile');
const _ = require('./utils');

class Compiler {
    constructor(el, vm) {
        // 3 stages: transclude, compile and link
        this.$vm = vm;
        this.$el = _.isElementNode(el) ? el : document.querySelector(el);

        //TODO:transclude
        //compile
        const dirs = compile(this.$el);
        // link
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
