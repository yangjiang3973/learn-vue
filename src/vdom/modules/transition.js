import { nextFrame } from '../../utils';

// TODO: maybe delete some code that is not used now
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
    const res = { ...def, ...autoCssTransition(def.name || 'v') };
    return res;
}

function autoCssTransition(name) {
    return {
        enterClass: `${name}-enter`,
        leaveClass: `${name}-leave`,
        // appearClass: `${name}-enter`,
        enterActiveClass: `${name}-enter-active`,
        leaveActiveClass: `${name}-leave-active`,
        // appearActiveClass: `${name}-enter-active`,
    };
}

function addTransitionClass(el, className) {
    el.classList.add(className);
}

function removeTransitionClass(el, className) {
    el.classList.remove(className);
}
