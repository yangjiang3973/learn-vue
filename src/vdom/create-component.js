import Aue from '../aue';
import VNode from './vnode';

function createComponent(tag, data, context, children) {
    // 1. extend
    const Ctor = Aue.extend(tag);

    // 2. extract props
    data = data || {};
    const propsData = extractProps(data, Ctor);

    // 3. add hooks to data
    data.hook = {};
    data.hook.init = function init(vnode) {
        if (!vnode.child) {
            // create a new component instance
            const vnodeComponentOptions = vnode.componentOptions;
            const options = {
                _isComponent: true,
                // parent,
                propsData: vnodeComponentOptions.propsData,
                // _componentTag: vnodeComponentOptions.tag,
                _parentVnode: vnode,
                _parentListeners: vnodeComponentOptions.listeners,
                _renderChildren: vnodeComponentOptions.children,
            };
            vnode.child = new vnode.componentOptions.Ctor(options);
            vnode.child.$mount(undefined); // add elm to vnode
        }
    };

    return new VNode(
        'vue-component',
        data,
        undefined,
        undefined,
        undefined,
        undefined,
        context,
        { Ctor, propsData, children }
        // { Ctor, propsData, listeners, children }
    );
}

function extractProps(data, Ctor) {
    const propsList = Ctor.options.props;
    if (!propsList) return;
    const res = {};

    for (const key in propsList) {
        // prop maybe in props, attrs or domProps
        if (data.attrs) {
            res[key] = data.attrs[key];
        }
        if (data.props) {
            res[key] = data.props[key];
        }
        if (data.domProps) {
            res[key] = data.domProps[key];
        }
    }
    return res;
}

export default createComponent;
