import dirParser from '../parsers/directive';
import textParser from '../parsers/text';
import {
    isElementNode,
    isTextNode,
    isDirective,
    isEventDirective,
} from '../utils';

/* return links: [{node, dirs}] */
export default function compile(el, vm) {
    const links = []; // [{node, dirs}]
    if (el.hasChildNodes()) {
        compileNodeList(el.childNodes, vm, links);
    }
    return links;
}

function compileNodeList(nodeList, vm, links) {
    let terminalFlag;
    for (let i = 0; i < nodeList.length; i++) {
        node = nodeList[i];
        terminalFlag = compileNode(node, vm, links);
        if (node.hasChildNodes() && !terminalFlag) {
            compileNodeList(node.childNodes, vm, links);
        }
    }
    return links;
}

function compileNode(node, vm, links) {
    if (isElementNode(node)) return compileElement(node, vm, links);
    else if (isTextNode(node)) {
        return compileText(node, vm, links);
    } else return null;
}

function compileText(node, vm, links) {
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
                descriptors: dirParser.parse(token.value), // also add filters into descriptor
                def: vm.options.directives[token.type],
            });
            links.push({ node: textNode, dirs });
        }
        frag.append(textNode);
    });
    node.parentNode.replaceChild(frag, node);
    return true;
}

function compileElement(node, vm, links) {
    let dirs = [];
    let nodeAttrs = Array.from(node.attributes);
    // check terminal directive here
    let terminalDir = checkTerminalDirectives(nodeAttrs, vm);
    dirs = collectDirectives(nodeAttrs, vm);
    links.push({ node, dirs });
    if (!terminalDir) {
        return false;
    } else {
        return true;
    }
}

function checkTerminalDirectives(attrs, vm) {
    const terminalDirectives = ['repeat', 'if', 'component'];
    for (let i = 0; i < attrs.length; i++) {
        const name = attrs[i].name;
        if (
            isDirective(name) &&
            terminalDirectives.includes(name.substring(2))
        ) {
            return true;
        }
    }
}

function collectDirectives(nodeAttrs, vm) {
    /* dirs=[{
        name(dirName),
        descriptor,
        def(dirDef),
        //transcluded
    }] */
    let dirs = [];
    nodeAttrs.forEach((attr) => {
        if (isDirective(attr.name)) {
            let dirName = attr.name.substring(2); // need to check event handler, such as v-on:click, vue 1.0 uses regExp
            let dirDef;
            if (isEventDirective(dirName)) {
                dirDef = vm.options.directives[dirName.substring(0, 2)];
            } else {
                dirDef = vm.options.directives[dirName];
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
