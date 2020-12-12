const { VNode } = require('./vnode');

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
            const compVnode = instance.render.call(instance, createElement);
            return compVnode;
        } else {
            return tag.call(null, createElement);
        }
    } else if (typeof tag === 'object') {
        const compVnode = tag.render.call(null, createElement);
        return compVnode;
    }
}

module.exports.createElement = createElement;

//<div id="1">
//    <span>Hello</span>
//    <span>world!</span>
//</div>

// render(h) {
//     return h("div", {
//       "attrs": {
//         "id": "1"
//       }
//     }, [h("span", ["Hello"]), h("span", ["world!"])]);
// }

//<div id="1">
//    fuck
//    <span>Hello</span>
//    <span>world!</span>
//</div>

// render(h) {
//     return h("div", {
//       "attrs": {
//         "id": "1"
//       }
//     }, ["fuck", h("span", ["Hello"]), h("span", ["world!"])]);
// }
