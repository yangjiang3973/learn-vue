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
            addNewData(vnode.elm, null, vnode);
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

function removeMissingData(elm, oldVnode, newVnode) {
    const oldData = oldVnode && oldVnode.data;
    const newData = newVnode && newVnode.data;

    for (let groupName in oldData) {
        switch (groupName) {
            case 'attrs':
                for (let k in oldData.attrs) {
                    if (!newData || !newData.attrs || !newData.attrs[k]) {
                        elm.removeAttribute(k);
                    }
                }
                break;
            case 'style':
                for (let k in oldData.style) {
                    if (!newData || !newData.style || !newData.style[k]) {
                        elm.style[k] = '';
                    }
                }
                break;
            case 'class':
                if (!newData || !newData.class) elm.className = '';
                break;
            case 'on':
                for (let k in oldData.on) {
                    elm.removeEventListener(k, oldData.on[k]);
                }
                break;
            default:
                if (!newData || !newData.groupName) {
                    elm.removeAttribute(groupName);
                }
                break;
        }
    }
}

function addNewData(elm, oldVnode, newVnode) {
    const oldData = oldVnode && oldVnode.data;
    const newData = newVnode && newVnode.data;

    // add to the elm if it is not in old data
    for (let groupName in newData) {
        switch (groupName) {
            case 'attrs':
                for (let k in newData.attrs) {
                    // if (!oldData || !oldData.attrs || !oldData.attrs[k])
                    elm.setAttribute(k, newData.attrs[k]);
                }
            case 'style':
                for (let k in newData.style) {
                    // if (!oldData || !oldData.style || !oldData.style[k])
                    elm.style[k] = newData.style[k];
                }
                break;
            case 'class':
                if (typeof newData.class === 'string') {
                    elm.className = newData.class;
                } else if (newData.class === 'object') {
                    elm.className = '';
                    for (let k in newData.class) {
                        if (newData.class[k]) elm.classList.add(k);
                    }
                }
                break;
            case 'on':
                for (let k in newData.on) {
                    elm.addEventListener(
                        k,
                        newData.on[k].bind(newVnode.context)
                    );
                }
                break;
            default:
                // if (!oldData || !oldData.groupName)
                elm.setAttribute(key, vnode.data[key]);

                break;
        }
    }
}

function patchData(elm, oldVnode, newVnode) {
    removeMissingData(elm, oldVnode, newVnode);
    addNewData(elm, oldVnode, newVnode);

    // recursively patch children nodes
    if (oldVnode.children || newVnode.children) {
        console.log(4);
        patchChildren(oldVnode.children, newVnode.children, elm);
    }
}

function patchChildren(oldChildren, newChildren, elm) {
    if (oldChildren && !newChildren) {
        // remove
        console.log(5);
        oldChildren.forEach((c) => {
            elm.removeChild(c.elm);
        });
    } else if (!oldChildren && newChildren) {
        // add
        console.log(6);
        newChildren.forEach((c) => {
            createElm(c);
            elm.appendChild(c.elm);
        });
    } else {
        // check the shorter children list
        console.log(7);

        const overlap =
            oldChildren.length > newChildren.length
                ? newChildren.length
                : oldChildren.length;

        for (let i = 0; i < overlap; i++) {
            console.log(8);
            patch(oldChildren[i], newChildren[i]);
        }

        // more new nodes, add them!
        if (newChildren.length > oldChildren.length) {
            console.log(9);
            for (let i = overlap; i < newChildren.length; i++) {
                createElm(newChildren[i]);
                elm.appendChild(newChildren[i].elm);
            }
        } else if (newChildren.length < oldChildren.length) {
            for (let i = overlap; i < oldChildren.length; i++) {
                elm.removeChild(oldChildren[i].elm);
            }
        }

        // oldChildren.forEach((c) => {
        //     elm.removeChild(c.elm);
        // });
        // newChildren.forEach((c) => {
        //     createElm(c);
        //     elm.appendChild(c.elm);
        // });
    }
}

function patch(oldVnode, newVnode) {
    let oldElm, parent, elm;

    if (oldVnode.nodeType) {
        console.log('1');
        // create an empty vnode and replace it
        oldVnode = emptyNodeAt(oldVnode);

        oldElm = oldVnode.elm;
        parent = oldElm.parentNode;

        // use vnode to generate real dom element
        createElm(newVnode);
    } else {
        if (oldVnode.tag !== newVnode.tag) {
            // different node type, no need to compare, just replace directly
            // replaceVnode(oldVnode, vnode);

            console.log('2');
            oldElm = oldVnode.elm;
            parent = oldElm.parentNode;

            createElm(newVnode);
        } else {
            console.log('3');
            elm = newVnode.elm = oldVnode.elm;
            if (oldVnode.tag === undefined) {
                console.log('3.1');
                elm.data = newVnode.text;
            } else patchData(elm, oldVnode, newVnode);
        }
    }

    if (parent != null) {
        parent.insertBefore(newVnode.elm, oldElm.nextSibling);
        parent.removeChild(oldElm);
        // removeVnodes(parent, [oldVnode], 0, 0);
    }

    return newVnode.elm;
}

module.exports = patch;
