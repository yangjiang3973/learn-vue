const { Watcher } = require('./watcher');
const { Dep } = require('./dep');

class Compiler {
    constructor(el, vm) {
        this.$vm = vm;
        this.$el = this.isElementNode(el) ? el : document.querySelector(el);

        if (this.$el) {
            this.$fragment = this.node2Fragment(this.$el);
            this.init();
            this.$el.appendChild(this.$fragment);
        }
    }

    init() {
        this.compileElement(this.$fragment);
    }

    node2Fragment(el) {
        var fragment = document.createDocumentFragment(),
            child;
        while ((child = el.firstChild)) {
            fragment.appendChild(child);
        }

        return fragment;
    }

    compileElement(el) {
        let childNodes = el.childNodes;
        let me = this;
        [].slice.call(childNodes).forEach((node) => {
            var text = node.textContent;
            var reg = /\{\{(.*)\}\}/;
            if (me.isElementNode(node)) me.compile(node);
            else if (me.isTextNode(node) && reg.test(text))
                me.compileText(node, RegExp.$1);

            if (node.childNodes && node.childNodes.length) {
                me.compileElement(node);
            }
        });
    }

    compile(node) {
        let nodeAttrs = node.attributes;
        let me = this;
        [].slice.call(nodeAttrs).forEach((attr) => {
            let attrName = attr.name;
            if (me.isDirective(attrName)) {
                let exp = attr.value;
                var dir = attrName.substring(2);
                if (me.isEventDirective(dir)) {
                    compileUtil.eventHandler(node, me.$vm, exp, dir);
                } else {
                    compileUtil[dir] && compileUtil[dir](node, me.$vm, exp);
                }

                node.removeAttribute(attrName);
            }
        });
    }

    compileText(node, exp) {
        compileUtil.text(node, this.$vm, exp);
    }

    isElementNode(node) {
        return node.nodeType === Node.ELEMENT_NODE;
    }

    isTextNode(node) {
        return node.nodeType === Node.TEXT_NODE;
    }

    isDirective(attr) {
        return attr.startsWith('v-');
    }

    isEventDirective(attr) {
        return attr.startsWith('on');
    }
}

let compileUtil = {
    text: function (node, vm, exp) {
        this.bind(node, vm, exp, 'text');
    },
    bind: function (node, vm, exp, dir) {
        let updateFn = updater[dir + 'Updater'];
        // first time init view?
        const watcher = new Watcher(vm, exp, function (value, oldValue) {
            updateFn && updateFn(node, value, oldValue);
        });
        Dep.target = watcher;
        updateFn && updateFn(node, vm[exp]); // v-text='word', exp is word
    },
};

let updater = {
    textUpdater: function (node, value) {
        // NOTE: node.textContent=value if value is not undefined
        node.textContent = typeof value == 'undefined' ? '' : value;
    },
};

module.exports.Compiler = Compiler;
