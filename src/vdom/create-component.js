import Aue from '../aue';
import VNode from './vnode';
import { hasOwn } from '../utils';

function createComponent(tag, data, context, children) {
    // 1. extend
    const Ctor = Aue.extend(tag);

    // 2. extract props
    data = data || {};
    const propsData = extractProps(data, Ctor);
    console.log(
        '🚀 ~ file: create-component.js ~ line 11 ~ createComponent ~ propsData',
        propsData
    );

    // extract listeners on component(not DOM listeners)
    const listeners = data.on;
    // TODO: what if there are native listeners

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
                _renderChildren: vnodeComponentOptions.children, // slots will be in children
            };
            vnode.child = new vnode.componentOptions.Ctor(options);
            vnode.child.$mount(undefined); // add elm to vnode.child as $el
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
        { Ctor, propsData, listeners, children }
    );
}

function extractProps(data, Ctor) {
    const propsList = Ctor.options.props;
    if (!propsList) return;
    const res = {};

    for (const key in propsList) {
        // prop maybe in props, attrs or domProps
        if (data.attrs && hasOwn(data.attrs, key)) {
            res[key] = data.attrs[key];
        }
        if (data.props && hasOwn(data.props, key)) {
            res[key] = data.props[key];
        }
        if (data.domProps && hasOwn(data.domProps, key)) {
            res[key] = data.domProps[key];
        }
    }
    return res;
}

export default createComponent;
