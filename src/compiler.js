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
        // NOTE: I do not understand here
        // is it equal to `var child;` ?
        var fragment = document.createDocumentFragment(),
            child;
        // NOTE: I also doubt here
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
                me.compile(node, RegExp.$1);

            if (node.childNodes && node.childNodes.length) {
                me.compileElement(node);
            }
        });
    }

    compile(node) {
        let nodeAttrs = node.attributes;
        let me = this;
        [].slice.call(nodeAttr).forEach((attr) => {
            let attrName = attr.name;
            if (me.isDirective(attrName)) {
                let exp = attr.value;
                var dir = attrName.substring(2);
                if (me.isEventDirective(dir)) {
                    compileUtil.eventHandler(node, me.$vm, exp, dir);
                } else {
                    compileUtil[dir] && compileUtil[dir](node, me.$vm, exp);
                }
            }
        });
    }
}

let compileUtil = {
    text: function (node, vm, exp) {
        this.bind(node, vm, exp, 'text');
    },
    bind: function (node, vm, exp, dir) {
        let updateFn = update[dir + 'Updater'];
        // first time init view?
        updateFn && updateFn(node, vm[exp]);
        new Watcher(vm, exp, function (value, oldValue) {
            updateFn && updateFn(node, value, oldValue);
        });
    },
};

let updater = {
    textUpdater: function (node, value) {
        // NOTE: node.textContent=value if value is not undefined
        node.textContent = typeof value == 'undefined' ? '' : value;
    },
};
