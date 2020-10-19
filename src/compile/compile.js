const _ = require('../utils');
const directives = require('../directives/index'); //NOTE: can i remove /index
const dirParser = require('../parsers/directive');
module.exports.compile = function compile(el) {
    if (el.hasChildNodes()) {
        return compileNodeList(el.childNodes);
    }
};

function compileNodeList(nodeList) {
    const links = []; // [{node, dirs}]
    for (let i = 0; i < nodeList.length; i++) {
        node = nodeList[i];
        const dirs = compileNode(node);
        links.push({ node, dirs });
        if (node.hasChildNodes()) {
            compileNodeList(node.childNodes);
        }
    }
    console.log('compileNodeList -> nodeLink', links); // need to optimize, if not dir, no need to add to links
    return links;
    // [].slice.call(childNodes).forEach((node) => {
    //     var text = node.textContent;
    //     var reg = /\{\{(.*)\}\}/;
    //     if (me.isElementNode(node)) me.compile(node);
    //     else if (me.isTextNode(node) && reg.test(text))
    //         me.compileText(node, RegExp.$1);

    //     if (node.childNodes && node.childNodes.length) {
    //         me.compileNodeList(node);
    //     }
    // });
}

function compileNode(node) {
    if (_.isElementNode(node)) return compileElement(node);
    // else if (_.isTextNode(node)) compileText(node);
    else return null;
}

function compileElement(node) {
    let nodeAttrs = Array.from(node.attributes);
    const dirs = collectDirectives(nodeAttrs);

    return dirs;
    // [].slice.call(nodeAttrs).forEach((attr) => {
    //     let attrName = attr.name;
    //     if (me.isDirective(attrName)) {
    //         let exp = attr.value;
    //         var dir = attrName.substring(2);
    //         if (me.isEventDirective(dir)) {
    //             compileUtil.eventHandler(node, me.$vm, exp, dir);
    //         } else {
    //             compileUtil[dir] && compileUtil[dir](node, me.$vm, exp);
    //         }

    //         node.removeAttribute(attrName);
    //     }
    // });
}

function collectDirectives(nodeAttrs) {
    /* dirs=[{
        name(dirName),
        descriptor,
        def(dirDef),
        //transcluded
    }] */
    let dirs = [];
    nodeAttrs.forEach((attr) => {
        if (_.isDirective(attr.name)) {
            const dirName = attr.name.substring(2);
            const dirDef = directives[dirName];
            if (dirDef) {
                dirs.push({
                    name: dirName,
                    descriptors: dirParser.parse(attr.value), // {raw: 'word', expression: 'word'}
                    def: dirDef,
                });
            }
        }
    });

    // TODO: sort dirs by priority, from low to heigh
    return dirs;
}

function compileText(node, exp) {
    compileUtil.text(node, this.$vm, exp);
}

let compileUtil = {
    text: function (node, vm, exp) {
        this.bind(node, vm, exp, 'text');
    },
    model: function (node, vm, exp) {
        this.bind(node, vm, exp, 'model');

        // reverse binding
        node.addEventListener(
            'input',
            (e) => {
                vm[exp] = e.target.value;
            },
            false
        );
    },
    bind: function (node, vm, exp, dir) {
        let updateFn = updater[dir + 'Updater'];
        // first time init view?
        // maybe move the following code to watcher's constructor
        // 在自身实例化时往属性订阅器(dep)里面添加自己
        const watcher = new Watcher(vm, exp, function (value, oldValue) {
            updateFn && updateFn(node, value, oldValue);
        });
        Dep.target = watcher;
        updateFn && updateFn(node, vm[exp]); // v-text='word', exp is word  // vm[exp] first time call getter to add sub
    },
    eventHandler: function (node, vm, exp, dir) {
        const eventType = dir.split(':')[1];
        const fn = vm[exp];

        if (eventType && fn) {
            node.addEventListener(eventType, fn.bind(vm), false);
        }
    },
};

let updater = {
    textUpdater: function (node, value) {
        // NOTE: node.textContent=value if value is not undefined
        node.textContent = typeof value === 'undefined' ? '' : value;
    },
    modelUpdater: function (node, value) {
        node.value = typeof value === 'undefined' ? '' : value;
    },
};
