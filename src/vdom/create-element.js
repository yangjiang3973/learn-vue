const { VNode } = require('./vnode');

module.exports.createElement = function (tag, data, children) {
    if (typeof tag === 'string') {
        return new VNode(tag, data, children);
    }
};
