import VNode from './vnode';
import { enter } from './modules/transition';

function emptyNodeAt(elm) {
    return new VNode(elm.tagName.toLowerCase(), {}, [], undefined, elm);
}

function createElm(vnode, nested, isSVG) {
    // check component first
    if (vnode.data) {
        if (vnode.data.hook && vnode.data.hook.init) {
            vnode.data.hook.init(vnode); // call init hook
            if (vnode.child) {
                // vnode.child is actually the component instance, vnode.child = new vnode.componentOptions.Ctor(options);
                // initComponent(vnode, insertedVnodeQueue);
                vnode.elm = vnode.child.$el;
                return vnode.elm;
            }
            return vnode.elm;
        }
    }

    isSVG = isSVG || vnode.ns;
    // maybe can avoid using undefined in vnode and here change to !== null
    if (vnode.tag != null) {
        vnode.elm = isSVG
            ? document.createElementNS('http://www.w3.org/2000/svg', vnode.tag)
            : document.createElement(vnode.tag);

        if (vnode.data) {
            addNewData(vnode.elm, null, vnode);
        }

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
            case 'domProps':
                for (let k in oldData.domProps) {
                    if (!newData || !newData.domProps || !newData.domProps[k]) {
                        elm.domProps[k] = undefined;
                    }
                }
                break;
            case 'ref':
                if (!newData || !newData.ref || newData.ref !== oldData.ref) {
                    const refName = oldData.ref;
                    delete oldVnode.context.$refs[refName];
                }
                break;
            // case 'directives':
            //     break;
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
            case 'transition':
                // call transition module
                // TODO: module
                enter(newVnode);
                break;
            case 'attrs':
                for (let k in newData.attrs) {
                    elm.setAttribute(k, newData.attrs[k]);
                }
            case 'style':
                for (let k in newData.style) {
                    elm.style[k] = newData.style[k];
                }
                break;
            case 'class':
                if (typeof newData.class === 'string') {
                    elm.className = newData.class;
                } else if (typeof newData.class === 'object') {
                    elm.className = '';
                    for (let k in newData.class) {
                        if (newData.class[k]) elm.classList.add(k);
                    }
                }
                break;
            case 'on':
                for (let k in newData.on) {
                    elm.addEventListener(k, newData.on[k]);
                }
                break;
            case 'domProps':
                for (let k in newData.domProps) {
                    elm[k] = newData.domProps[k];
                }
                break;
            case 'ref':
                const refName = newData.ref;
                newVnode.context.$refs[refName] = elm;
                break;
            case 'directives':
                const dirs = newData.directives;
                dirs.forEach((dir) => {
                    if (dir.name === 'show') {
                        elm.style.display = dir.value ? '' : 'none';
                    }
                });
                break;
            default:
                if (!oldData || !oldData.groupName)
                    elm.setAttribute(groupName, newData[groupName]);
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
        console.log(7);
        let maxIndex = 0;
        for (let i = 0; i < newChildren.length; i++) {
            let j = 0;
            let flag = false;
            for (j; j < oldChildren.length; j++) {
                if (
                    newChildren[i].key !== undefined &&
                    newChildren[i].key === oldChildren[j].key
                ) {
                    flag = true;
                    patch(oldChildren[j], newChildren[i]);
                    if (j < maxIndex) {
                        const refElm = newChildren[i - 1].elm.nextSibling;
                        elm.insertBefore(oldChildren[j].elm, refElm);
                        break;
                    } else {
                        maxIndex = j;
                    }
                }
            }
            if (flag === false) {
                const refElm =
                    i < 1
                        ? oldChildren[0].elm
                        : newChildren[i - 1].elm.nextSibling;
                createElm(newChildren[i]);
                elm.insertBefore(newChildren[i].elm, refElm);
            }
        }

        for (let i = 0; i < oldChildren.length; i++) {
            let flag = false;
            for (let j = 0; j < newChildren.length; j++) {
                if (
                    newChildren[j].key !== undefined &&
                    newChildren[j].key === oldChildren[i].key
                ) {
                    flag = true;
                }
            }
            if (flag === false) {
                console.log('remove');
                elm.removeChild(oldChildren[i].elm);
            }
        }
    }
}

function patch(oldVnode, newVnode) {
    if (!oldVnode) {
        createElm(newVnode);
    } else {
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
            // different node type, no need to compare, just replace directly
            if (oldVnode.tag !== newVnode.tag) {
                console.log('2');
                oldElm = oldVnode.elm;
                parent = oldElm.parentNode;
                createElm(newVnode);
            } else {
                console.log('3');
                elm = newVnode.elm = oldVnode.elm;
                // patch text
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
    }
    return newVnode.elm;
}

export default patch;
