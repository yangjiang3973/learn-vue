const _ = require('../utils');
const dirParser = require('../parsers/directive');
const textParser = require('../parsers/text');

/* return links: [{node, dirs}] */
module.exports = function compile(el, directives) {
    const links = []; // [{node, dirs}]
    if (el.hasChildNodes()) {
        compileNodeList(el.childNodes, directives, links);
    }
    return links;
};

function compileNodeList(nodeList, directives, links) {
    let terminalFlag;
    for (let i = 0; i < nodeList.length; i++) {
        node = nodeList[i];
        terminalFlag = compileNode(node, directives, links);
        if (node.hasChildNodes() && !terminalFlag) {
            compileNodeList(node.childNodes, directives, links);
        }
    }
    return links;
}

function compileNode(node, directives, links) {
    if (_.isElementNode(node)) return compileElement(node, directives, links);
    else if (_.isTextNode(node)) {
        return compileText(node, directives, links);
    } else return null;
}

function compileText(node, directives, links) {
    const tokens = textParser.parse(node.data); // [{type: 'text', value:'title'}, {type: null, value: 'intro'}, {type: 'text', value: 'intro'}]
    // also need to replace the old node
    if (!tokens) return true;
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
