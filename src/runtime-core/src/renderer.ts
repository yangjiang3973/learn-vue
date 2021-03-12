export function render(vnode, container) {
    // if (vnode == null) {
    //     if (container._vnode) {
    //       unmount(container._vnode, null, null, true)
    //     }
    //   } else {
    patch(container._vnode || null, vnode, container);
    //   }
}

function patch(oldVNode, newVNode, container) {
    // vue3 does not check newly insert or update at the beginning,
    // instead, check newVNode type first, then check existance of oldVNode on each case
    if (!oldVNode) {
        // new insert
        if (newVNode.type === 'string') {
            document.createElement(newVNode.type);
        } else if (newVNode.type === 'object') {
            processComponent(oldVNode, newVNode, container);
        }
    }
}

function processComponent(oldVNode, newVNode, container) {}
