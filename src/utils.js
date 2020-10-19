/**
 * Check is a string starts with $ or _
 *
 * @param {String} str
 * @return {Boolean}
 */

module.exports.isReserverd = function (str) {
    return str.startsWith('$') || str.startsWith('_');
};

module.exports.isElementNode = function isElementNode(node) {
    return node.nodeType === Node.ELEMENT_NODE;
};

module.exports.isTextNode = function isTextNode(node) {
    return node.nodeType === Node.TEXT_NODE;
};

module.exports.isDirective = function isDirective(attr) {
    return attr.startsWith('v-');
};

module.exports.isEventDirective = function isEventDirective(attr) {
    return attr.startsWith('on');
};
