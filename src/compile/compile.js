const _ = require('../utils');
const dirParser = require('../parsers/directive');

/* return links: [{node, dirs}] */
module.exports = function compile(el, directives) {
    if (el.hasChildNodes()) {
        return compileNodeList(el.childNodes, directives);
    }
};

function compileNodeList(nodeList, directives) {
    let links = []; // [{node, dirs}]
    let dirs, terminalFlag;
    for (let i = 0; i < nodeList.length; i++) {
        node = nodeList[i];
        const nodeInfo = compileNode(node, directives);
        if (nodeInfo) {
            dirs = nodeInfo.dirs;
            terminalFlag = nodeInfo.terminalFlag;
        } else {
            dirs = null;
            terminalFlag = false;
        }
        links.push({ node, dirs });
        // need to check terminal directive, if terminal, stop compiling sub tree
        if (node.hasChildNodes() && !terminalFlag) {
            links = links.concat(compileNodeList(node.childNodes, directives));
        }
    }
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

function compileNode(node, directives) {
    if (_.isElementNode(node)) return compileElement(node, directives);
    // else if (_.isTextNode(node)) compileText(node);
    else return null;
}

function compileElement(node, directives) {
    let dirs = [];
    let nodeAttrs = Array.from(node.attributes);
    // check terminal directive here
    let terminalDir = checkTerminalDirectives(nodeAttrs, directives);
    if (!terminalDir) {
        dirs = collectDirectives(nodeAttrs, directives);
        return { dirs, terminalFlag: false };
    } else {
        return { dirs: terminalDir, terminalFlag: true };
    }
}

function checkTerminalDirectives(attrs, directives) {
    const terminalDirectives = ['repeat', 'if', 'component'];
    for (let i = 0; i < attrs.length; i++) {
        const name = attrs[i].name;
        if (
            _.isDirective(name) &&
            terminalDirectives.includes(name.substring(2))
        ) {
            return [
                {
                    name: name.substring(2),
                    descriptors: dirParser.parse(attrs[i].value),
                    def: directives[name.substring(2)],
                },
            ];
        }
    }
}

function collectDirectives(nodeAttrs, directives) {
    /* dirs=[{
        name(dirName),
        descriptor,
        def(dirDef),
        //transcluded
    }] */
    let dirs = [];
    nodeAttrs.forEach((attr) => {
        if (_.isDirective(attr.name)) {
            let dirName = attr.name.substring(2); // need to check event handler, such as v-on:click, vue 1.0 uses regExp
            let dirDef;
            if (_.isEventDirective(dirName)) {
                dirDef = directives[dirName.substring(0, 2)];
            } else {
                dirDef = directives[dirName];
            }

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

// function compileText(node, exp) {
//     compileUtil.text(node, this.$vm, exp);
// }

// let compileUtil = {
//     text: function (node, vm, exp) {
//         this.bind(node, vm, exp, 'text');
//     },
//     model: function (node, vm, exp) {
//         this.bind(node, vm, exp, 'model');

//         // reverse binding
//         node.addEventListener(
//             'input',
//             (e) => {
//                 vm[exp] = e.target.value;
//             },
//             false
//         );
//     },
//     bind: function (node, vm, exp, dir) {
//         let updateFn = updater[dir + 'Updater'];
//         // first time init view?
//         // maybe move the following code to watcher's constructor
//         // 在自身实例化时往属性订阅器(dep)里面添加自己
//         const watcher = new Watcher(vm, exp, function (value, oldValue) {
//             updateFn && updateFn(node, value, oldValue);
//         });
//         Dep.target = watcher;
//         updateFn && updateFn(node, vm[exp]); // v-text='word', exp is word  // vm[exp] first time call getter to add sub
//     },
//     eventHandler: function (node, vm, exp, dir) {
//         const eventType = dir.split(':')[1];
//         const fn = vm[exp];

//         if (eventType && fn) {
//             node.addEventListener(eventType, fn.bind(vm), false);
//         }
//     },
// };

// let updater = {
//     textUpdater: function (node, value) {
//         // NOTE: node.textContent=value if value is not undefined
//         node.textContent = typeof value === 'undefined' ? '' : value;
//     },
//     modelUpdater: function (node, value) {
//         node.value = typeof value === 'undefined' ? '' : value;
//     },
// };
