const { VNode } = require('./vnode');
const { Watcher } = require('../watcher');

function createElement(tag, data, children) {
    if (data && (Array.isArray(data) || typeof data !== 'object')) {
        children = data;
        data = undefined;
    }

    if (typeof tag === 'string') {
        if (Array.isArray(children)) {
            for (let i = 0; i < children.length; i++) {
                if (typeof children[i] === 'string') {
                    // text node
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
            //* theoretically should call mounted hook here, and maybe need to change mount code
            instance._mounted = true;
            return instance.$vnode;
        } else {
            return tag.call(null, createElement);
        }
    } else if (typeof tag === 'object') {
        console.log(tag);
        const compVnode = tag.render.call(null, createElement);
        console.log(
            '🚀 ~ file: create-element.js ~ line 81 ~ createElement ~ compVnode',
            compVnode
        );
        return compVnode;
    }
}

module.exports.createElement = createElement;
