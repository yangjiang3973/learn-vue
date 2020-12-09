const { VNode } = require('./vnode');

module.exports.createElement = function (tag, data, children) {
    if (data && (Array.isArray(data) || typeof data !== 'object')) {
        children = data;
        data = undefined;
    }

    if (typeof tag === 'string') {
        if (Array.isArray(children)) {
            for (let i = 0; i < children.length; i++) {
                if (typeof children[i] === 'string') {
                    children[i] = new VNode(
                        undefined,
                        undefined,
                        undefined,
                        children[i]
                    );
                }
            }
        }
        return new VNode(tag, data, children);
    }
};

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
