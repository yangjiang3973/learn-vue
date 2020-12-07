const hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn(obj, key) {
    return hasOwnProperty.call(obj, key);
}
module.exports.hasOwn = hasOwn;

// TODO: why move set/delete here?
// where these 2 func be used?
module.exports.set = function (obj, key, val) {
    if (hasOwn(obj, key)) {
        obj[key] = val;
        return;
    }
    if (obj._isVue) {
        this.set(obj._data, key, val);
        return;
    }
    const ob = obj.__ob__;
    if (!ob) {
        obj[key] = val;
        return;
    }
    ob.defineReactive(obj, key, val); // add new key/val pair to obj
    if (ob.vm) {
        ob.vm._proxyData(key);
        ob.vm._digest();
    } else ob.dep.notify();
    return val;
};

module.exports.delete = function (obj, key) {
    if (!hasOwn(obj, key)) return;

    delete obj[key];
    const ob = obj.__ob__;
    if (!ob) {
        // obj===vm
        if (obj._isVue) {
            delete obj._data[key];
            obj._digest();
        }
        return;
    }
    if (ob.vm) {
        ob.vm._unproxyData(key);
        ob.vm._digest();
    } else ob.dep.notify();
};

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

module.exports.query = function (el) {
    if (typeof el === 'string') {
        const selector = el;
        el = document.querySelector(el);
        if (!el) {
            process.env.NODE_ENV !== 'production' &&
                warn('Cannot find element: ' + selector);
            return document.createElement('div');
        }
    }
    return el;
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
