const { VNode } = require('./vnode');
function emptyNodeAt(elm) {
    return new VNode(elm.tagName.toLowerCase(), {}, [], undefined, elm);
}

function createElm(vnode, nested, isSVG) {
    isSVG = isSVG || vnode.ns;
    // maybe can avoid using undefined in vnode and here change to !== null
    if (vnode.tag != null) {
        vnode.elm = isSVG
            ? document.createElementNS('http://www.w3.org/2000/svg', vnode.tag)
            : document.createElement(vnode.tag);
        if (vnode.data) {
            for (let key in vnode.data) {
                switch (key) {
                    case 'attrs':
                        for (let k in vnode.data.attrs) {
                            vnode.elm.setAttribute(k, vnode.data.attrs[k]);
                        }
                    case 'style':
                        for (let k in vnode.data.style) {
                            vnode.elm.style[k] = vnode.data.style[k];
                        }
                        break;
                    case 'class':
                        if (typeof vnode.data.class === 'string')
                            vnode.elm.classList.add(vnode.data.class);
                        else if (typeof vnode.data.class === 'object') {
                            for (let k in vnode.data.class) {
                                if (vnode.data.class[k]) {
                                    vnode.elm.classList.add(k);
                                }
                            }
                        }
                    case 'on':
                        for (let k in vnode.data.on) {
                            vnode.elm.addEventListener(k, vnode.data.on[k]);
                        }
                    default:
                        vnode.elm.setAttribute(key, vnode.data[key]);
                        break;
                }
            }
        }
        // it seems this is a scope for css
        // setScope(vnode);
        if (Array.isArray(vnode.children)) {
            createChildren(vnode, vnode.children, isSVG);
        }
    } else if (vnode.isComment) {
        vnode.elm = document.createComment(vnode.text);
    } else {
        vnode.elm = document.createTextNode(vnode.text);
    }
    return vnode.elm;
}

function createChildren(vnode, children, isSVG) {
    for (let i = 0; i < children.length; ++i) {
        const child = createElm(children[i], true, isSVG);
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
