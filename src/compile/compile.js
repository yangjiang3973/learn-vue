const _ = require('../utils');
const dirParser = require('../parsers/directive');
const textParser = require('../parsers/text');

/* return links: [{node, dirs}] */
module.exports = function compile(el, directives) {
    const links = []; // [{node, dirs}]
    if (el.hasChildNodes()) {
        // return compileNodeList(el.childNodes, directives, links);
        compileNodeList(el.childNodes, directives, links);
    }
    return links;
};

function compileNodeList(nodeList, directives, links) {
    let terminalFlag;
    for (let i = 0; i < nodeList.length; i++) {
        node = nodeList[i];
        // const nodeInfo = compileNode(node, directives, links);
        terminalFlag = compileNode(node, directives, links);
        // if (nodeInfo) {
        //     dirs = nodeInfo.dirs; // nodeInfo={dirs, terminalFlag}
        //     terminalFlag = nodeInfo.terminalFlag;
        // } else {
        //     dirs = null;
        //     terminalFlag = false;
        // }
        // links.push({ node, dirs });
        // need to check terminal directive, if terminal, stop compiling sub tree
        // if (node.hasChildNodes() && !terminalFlag) {
        if (node.hasChildNodes() && !terminalFlag) {
            // links = links.concat(compileNodeList(node.childNodes, directives));
            compileNodeList(node.childNodes, directives, links);
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

function compileNode(node, directives, links) {
    if (_.isElementNode(node)) return compileElement(node, directives, links);
    else if (_.isTextNode(node)) {
        return compileText(node, directives, links);
    } else return null;
}

function compileText(node, directives, links) {
    // parse text string to check {{ }}
    // if it has {{ }}, the type is v-text and value inside {{ }} is the variable
    // for example, <div> {{ title1 }} --- {{ title2 }} </div>
    const tokens = textParser.parse(node.data); // [{type: 'text', value:'title'}, {type: null, value: 'intro'}, {type: 'text', value: 'intro'}]
    // also need to replace the old node
    if (!tokens) return true;
    // console.log('compileText -> tokens', tokens);
    const frag = document.createDocumentFragment();
    tokens.forEach((token) => {
        const textNode = document.createTextNode('');
        if (!token.type) {
            textNode.data = token.value;
        } else {
            const dirs = [];
            dirs.push({
                name: token.type,
                descriptors: dirParser.parse(token.value), // {raw: 'word', expression: 'word'}
                def: directives[token.type],
            });
            links.push({ node: textNode, dirs });
        }
        frag.append(textNode);
    });
    node.parentNode.replaceChild(frag, node);
    return true;
}

function compileElement(node, directives, links) {
    let dirs = [];
    let nodeAttrs = Array.from(node.attributes);
    // check terminal directive here
    let terminalDir = checkTerminalDirectives(nodeAttrs, directives);
    if (!terminalDir) {
        dirs = collectDirectives(nodeAttrs, directives);
        links.push({ node, dirs });
        return false;
    } else {
        links.push({ node, dirs: terminalDir });
        return true;
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
