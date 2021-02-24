import { nextFrame } from '../../utils';

// TODO: maybe delete some code that is not used now
export function enter(vnode) {
    const data = resolveTransition(vnode.data.transition);

    const {
        css,
        type,
        enterClass,
        enterToClass,
        enterActiveClass,
        appearClass,
        appearToClass,
        appearActiveClass,
        beforeEnter,
        enter,
        afterEnter,
        enterCancelled,
        beforeAppear,
        appear,
        afterAppear,
        appearCancelled,
        duration,
    } = data;

    const startClass = enterClass;
    const activeClass = enterActiveClass;
    addTransitionClass(vnode.elm, startClass); // startClass = fade-enter
    addTransitionClass(vnode.elm, activeClass);

    nextFrame(() => {
        removeTransitionClass(vnode.elm, startClass);
        // also need to remove activeClass after transition finishes
        const styles = window.getComputedStyle(vnode.elm);
        const transitioneDelays = styles['transitionDelay'].split(', ');
        const transitionDurations = styles['transitionDuration'].split(', ');
        const transitionTimeout = getTimeout(
            transitioneDelays,
            transitionDurations
        );
        setTimeout(() => {
            removeTransitionClass(vnode.elm, activeClass);
        }, transitionTimeout + 1);
    });
}

export function leave(vnode, rm) {
    // console.log('🚀 ~ file: transition.js ~ line 46 ~ leave ~ vnode', vnode);
    const data = resolveTransition(vnode.data.transition);
    if (!data) return rm();

    const {
        css,
        type,
        leaveClass,
        leaveToClass,
        leaveActiveClass,
        beforeLeave,
        leave,
        afterLeave,
        leaveCancelled,
        delayLeave,
        duration,
    } = data;

    addTransitionClass(vnode.elm, leaveClass);
    addTransitionClass(vnode.elm, leaveActiveClass);
    nextFrame(() => {
        removeTransitionClass(vnode.elm, leaveClass);
        addTransitionClass(vnode.elm, leaveToClass);
        const styles = window.getComputedStyle(vnode.elm);
        const transitioneDelays = styles['transitionDelay'].split(', ');
        const transitionDurations = styles['transitionDuration'].split(', ');
        const transitionTimeout = getTimeout(
            transitioneDelays,
            transitionDurations
        );
        setTimeout(() => {
            removeTransitionClass(vnode.elm, leaveActiveClass);
            rm();
        }, transitionTimeout + 1);
    });
}

function getTimeout(delays, durations) {
    return Math.max.apply(
        null,
        durations.map((d, i) => {
            return toMs(d) + toMs(delays[i]);
        })
    );
}

function toMs(s) {
    return Number(s.slice(0, -1)) * 1000;
}

function resolveTransition(def) {
    if (!def) return;
    const res = { ...def, ...autoCssTransition(def.name || 'v') };
    return res;
}

function autoCssTransition(name) {
    return {
        enterClass: `${name}-enter`,
        enterToClass: `${name}-enter-to`,
        enterActiveClass: `${name}-enter-active`,
        leaveClass: `${name}-leave`,
        leaveToClass: `${name}-leave-to`,
        leaveActiveClass: `${name}-leave-active`,
    };
}

function addTransitionClass(el, className) {
    el.classList.add(className);
}

function removeTransitionClass(el, className) {
    el.classList.remove(className);
}
