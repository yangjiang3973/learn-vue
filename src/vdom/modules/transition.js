export function enter(vnode) {
    const data = resolveTransition(vnode.data.transition);
    // if (!data) return;

    const {
        css,
        type,
        enterClass,
        enterActiveClass,
        appearClass,
        appearActiveClass,
        beforeEnter,
        enter,
        afterEnter,
        enterCancelled,
        beforeAppear,
        appear,
        afterAppear,
        appearCancelled,
    } = data;

    // const isAppear = !context._isMounted || !vnode.isRootInsert;
    // if (isAppear && !appear && appear !== '') {
    //     return;
    // }

    // const startClass = isAppear ? appearClass : enterClass;
    // const activeClass = isAppear ? appearActiveClass : enterActiveClass;
    const startClass = enterClass;
    const activeClass = enterActiveClass;

    addTransitionClass(el, startClass);
    addTransitionClass(el, activeClass);

    nextFrame(() => {
        removeTransitionClass(el, startClass);
        if (!cb.cancelled && !userWantsControl) {
            whenTransitionEnds(el, type, cb);
        }
    });
}

// this wrapper is for fallback of setTimeout, maybe could remove if only use requestAnimationFrame
// const raf = (inBrowser && window.requestAnimationFrame) || setTimeout
// export function nextFrame (fn: Function) {
//   raf(() => {
//     raf(fn)
//   })
// }

function nextFrame() {

}

function resolveTransition(def) {
    // if(!def) return;
    // if(typeof def === 'object') {}

    const res = {};
    res = { ...def, ...autoCssTransition(def.name || 'v') };
    return res;
}

function autoCssTransition(name) {
    return {
        enterClass: `${name}-enter`,
        leaveClass: `${name}-leave`,
        appearClass: `${name}-enter`,
        enterActiveClass: `${name}-enter-active`,
        leaveActiveClass: `${name}-leave-active`,
        appearActiveClass: `${name}-enter-active`,
    };
}

function addTransitionClass(el, class) {
    el.classList.add(class)
}