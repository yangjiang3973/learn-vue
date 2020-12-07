const { VNode } = require('./vnode');

module.exports.createElement = function (tag, data, children) {
    if (data && (Array.isArray(data) || typeof data !== 'object')) {
        children = data;
        data = undefined;
    }

    if (typeof tag === 'string') {
        return new VNode(tag, data, children);
    }
};
