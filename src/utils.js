module.exports.set = function (key, val) {};

var toString = Object.prototype.toString;
var OBJECT_STRING = '[object Object]';
module.exports.isPlainObject = function (obj) {
    return toString.call(obj) === OBJECT_STRING;
};

module.exports.isArray = function (obj) {
    return Array.isArray(obj);
};

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

module.exports.inBrowser =
    typeof window !== 'undefined' &&
    toString.call(window) !== '[object Object]';

module.exports.warn = function (msg) {
    console.warn('[Aue warn]: ' + msg);
};

module.exports.nextTick = function (cb) {
    function handler() {
        cb();
    }
    // make a mutation observer
    const DOMObserver = new MutationObserver(handler);
    // make a node to trigger dom observer
    let tempText = 1;
    const tempNode = document.createTextNode(tempText);
    DOMObserver.observe(tempNode, { characterData: true });
    // trigger the node change and the handler will run as microtask
    tempNode.data = tempText = (tempText + 1) % 2;
};
