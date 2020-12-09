const { VNode } = require('./vnode');
function emptyNodeAt(elm) {
    return new VNode(elm.tagName.toLowerCase(), {}, [], undefined, elm);
}

function createElm(vnode, nested) {
    if (vnode.tag != null) {
        vnode.elm = document.createElement(vnode.tag);
        // it seems this is a scope for css
        // setScope(vnode);
        if (Array.isArray(vnode.children)) {
            createChildren(vnode, vnode.children);
        }
    } else if (vnode.isComment) {
        vnode.elm = document.createComment(vnode.text);
    } else {
        console.log('createElm -> vnode.text', vnode.text);
        vnode.elm = document.createTextNode(vnode.text);
    }
    return vnode.elm;
}

function createChildren(vnode, children) {
    for (let i = 0; i < children.length; ++i) {
        const child = createElm(children[i], true);
        vnode.elm.appendChild(child);
    }
}

module.exports = function patch(oldVnode, vnode, hydrating, removeOnly) {
    // either not server-rendered, or hydration failed.
    // create an empty vnode and replace it
    oldVnode = emptyNodeAt(oldVnode);

    oldElm = oldVnode.elm;
    parent = oldElm.parentNode;

    // use vnode to generate real dom element
    createElm(vnode);

    if (parent !== null) {
        parent.insertBefore(vnode.elm, oldElm.nextSibling);
        parent.removeChild(oldElm);
        // removeVnodes(parent, [oldVnode], 0, 0);
    }
    return vnode.elm;
};
