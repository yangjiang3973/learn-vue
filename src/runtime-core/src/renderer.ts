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
    if (!oldVNode) {
    }
}
