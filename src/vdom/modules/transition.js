export function enter(vnode) {
    const data = resolveTransition(vnode.data.transition);
    console.log('🚀 ~ file: transition.js ~ line 3 ~ enter ~ data', data);
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
    console.log(
        '🚀 ~ file: transition.js ~ line 31 ~ enter ~ startClass',
        startClass
    );
    const activeClass = enterActiveClass;
    console.log(
        '🚀 ~ file: transition.js ~ line 33 ~ enter ~ activeClass',
        activeClass
    );

    addTransitionClass(vnode.elm, startClass);
    addTransitionClass(vnode.elm, activeClass);

    window.requestAnimationFrame(() => {
        removeTransitionClass(vnode.elm, startClass);
        // if (!cb.cancelled && !userWantsControl) {
        //     whenTransitionEnds(el, type, cb);
        // }
    });
}

function resolveTransition(def) {
    // if(!def) return;
    // if(typeof def === 'object') {}

    const res = { ...def, ...autoCssTransition(def.name || 'v') };
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

function addTransitionClass(el, className) {
    el.classList.add(className);
}

function removeTransitionClass(el, className) {
    el.classList.remove(className);
}
