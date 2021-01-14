import { warn } from '../utils';

export default {
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

        // init check done, start main logic
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

        console.log('transition component setup');
        // TODO: I don't get it here
        // if this is a component root node and the component's
        // parent container node also has transition, skip.
        // if (hasParentTransition(this.$vnode)) {
        //     return rawChild;
        // }
    },
};

const transitionProps = {
    name: String,
    appear: Boolean,
    css: Boolean,
    mode: String,
    type: String,
    enterClass: String,
    leaveClass: String,
    enterActiveClass: String,
    leaveActiveClass: String,
    appearClass: String,
    appearActiveClass: String,
};
