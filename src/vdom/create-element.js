import VNode from './vnode';
import Watcher from '../watcher';
import createComponent from './create-component';
import { capitalize, resolveAssets } from '../utils';

function createElement(tag, data, children) {
    // if no props, data will hold child nodes and children will be undefined
    if (data && (Array.isArray(data) || typeof data !== 'object')) {
        children = data;
        data = undefined;
    }

    if (typeof tag === 'string') {
        if (Array.isArray(children)) {
            // TODO: use normalizeChild??
            children = children.flat(); // by default, just one level depth
            children = children.filter((c) => {
                return c != null;
            });
            for (let i = 0; i < children.length; i++) {
                // text node
                if (typeof children[i] === 'string') {
                    children[i] = new VNode(
                        undefined,
                        undefined,
                        undefined,
                        children[i],
                        undefined,
                        false,
                        this
                    );
                } else if (typeof children[i] === 'number') {
                    children[i] = children[i].toString();
                    children[i] = new VNode(
                        undefined,
                        undefined,
                        undefined,
                        children[i],
                        undefined,
                        false,
                        this
                    );
                }
            }
        }
        let Ctor;
        if (tag === 'svg') {
            return new VNode(
                tag,
                data,
                children,
                undefined,
                undefined,
                true,
                this
            );
        } else if ((Ctor = resolveAssets(this.$options, 'components', tag))) {
            return createComponent(Ctor, data, this, children);
        }
        return new VNode(
            tag,
            data,
            children,
            undefined,
            undefined,
            false,
            this
        );
    } else if (typeof tag === 'function') {
        //need to check prototype's render function to differ from class and function
        if (tag.prototype && tag.prototype.render) {
            const instance = new tag();
            instance.props = data.props;

            instance._update = function (vnode) {
                const preVnode = this.$vnode;
                if (preVnode) {
                    this.__patch__(preVnode, vnode);
                }
                this.$vnode = vnode;
            };

            new Watcher(
                instance,
                // pass a fn to watcher. this._render() will run first, then this._update().  this._render() is from file render.js
                // _render() will return a vnode
                () => {
                    instance._update(
                        instance.render(createElement.bind(instance))
                    );
                },
                () => {}
            );
            //* TODO: theoretically should call mounted hook here, and maybe need to change mount code
            instance._mounted = true;
            return instance.$vnode;
        } else {
            return tag.call(null, createElement);
        }
    } else if (typeof tag === 'object') {
        return createComponent(tag, data, this, children);
    }
}

export default createElement;
