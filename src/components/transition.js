import { warn } from '../utils';

const transitionProps = {
    name: undefined,
    appear: undefined,
    css: undefined,
    mode: undefined,
    type: undefined,
    enterClass: undefined,
    leaveClass: undefined,
    enterActiveClass: undefined,
    leaveActiveClass: undefined,
    appearClass: undefined,
    appearActiveClass: undefined,
};

const transition = {
    name: 'transition',
    props: transitionProps,
    abstract: true,
    render(h) {
        let children = this.$slots.default;
        if (!children) return;
        children = children.filter((c) => c.tag);
        if (!children.length) return;

        if (process.env.NODE_ENV !== 'production' && children.length > 1) {
            warn(
                '<transition> can only be used on a single element. Use ' +
                    '<transition-group> for lists.'
            );
        }
        // init ends, start main logic

        const mode = this.mode;
        // warn invalid mode
        if (
            process.env.NODE_ENV !== 'production' &&
            mode &&
            mode !== 'in-out' &&
            mode !== 'out-in'
        ) {
            warn('invalid <transition> mode: ' + mode);
        }

        const rawChild = children[0];

        // TODO: I don't get it here
        // if this is a component root node and the component's
        // parent container node also has transition, skip.
        // if (hasParentTransition(this.$vnode)) {
        //     return rawChild;
        // }

        // TODO: why need to getRealChild?
        // const child = getRealChild(rawChild);

        const child = rawChild;
        // TODO: need to make more clear about this piece

        const data = ((
            child.data || (child.data = {})
        ).transition = extractTransitionData(this)); //* data={name: modal}, child.data.transition = {name: modal}

        return rawChild;
    },
};

function extractTransitionData(comp) {
    const data = {};
    const options = comp.$options;
    // props
    for (const key in options.propsData) {
        data[key] = comp[key];
    }
    // events.
    // extract listeners and pass them directly to the transition methods
    const listeners = options._parentListeners;
    for (const key in listeners) {
        data[camelize(key)] = listeners[key].fn;
    }
    return data;
}

export default transition;
