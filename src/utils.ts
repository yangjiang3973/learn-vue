// TODO: why move set/delete here?
// where these 2 func be used?
// export const set = function (obj, key, val) {
//     if (hasOwn(obj, key)) {
//         obj[key] = val;
//         return;
//     }
//     if (obj._isAue) {
//         this.set(obj._data, key, val);
//         return;
//     }
//     const ob = obj.__ob__;
//     if (!ob) {
//         obj[key] = val;
//         return;
//     }
//     ob.defineReactive(obj, key, val); // add new key/val pair to obj
//     if (ob.vm) {
//         ob.vm._proxyData(key);
//         ob.vm._digest();
//     } else ob.dep.notify();
//     return val;
// };

// export const delete = function (obj, key) {
//     if (!hasOwn(obj, key)) return;

//     delete obj[key];
//     const ob = obj.__ob__;
//     if (!ob) {
//         // obj===vm
//         if (obj._isAue) {
//             delete obj._data[key];
//             obj._digest();
//         }
//         return;
//     }
//     if (ob.vm) {
//         ob.vm._unproxyData(key);
//         ob.vm._digest();
//     } else ob.dep.notify();
// };

export const resolveAssets = function (options, type, key) {
    return options[type][key] || options[type][capitalize(key)];
};

export const hasOwn = function (obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
};

export const NOOP = () => {};

//* NOTE: compare whether a value has changed, accounting for NaN. (NaN === NaN => false)
export const hasChanged = (value, oldValue) =>
    value !== oldValue && (value === value || oldValue === oldValue);

export const capitalize = function (s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
};

export const def = (obj: object, key: string | symbol, value: any) => {
    Object.defineProperty(obj, key, {
        configurable: true,
        enumerable: false,
        value,
    });
};

export const objectToString = Object.prototype.toString;
export const toTypeString = (value: unknown): string =>
    objectToString.call(value);

var OBJECT_STRING = '[object Object]';

export const isPlainObject = function (obj) {
    return toTypeString.call(obj) === OBJECT_STRING;
};

export const isMap = (val: unknown): val is Map<any, any> =>
    toTypeString(val) === '[object Map]';

export const isArray = function (obj) {
    return Array.isArray(obj);
};

export const isString = (val: unknown): val is string =>
    typeof val === 'string';

export const isIntegerKey = (key: unknown) =>
    isString(key) &&
    key !== 'NaN' &&
    key[0] !== '-' && // negative integer
    '' + parseInt(key, 10) === key;

export const isObject = function (obj) {
    return obj !== null && typeof obj === 'object';
};
export const isFunction = (val: unknown): val is Function =>
    typeof val === 'function';

export const isSymbol = (val: unknown): val is symbol =>
    typeof val === 'symbol';

export const toRawType = (value) => {
    // extract "RawType" from strings like "[object RawType]"
    return toTypeString(value).slice(8, -1);
};

export const isReserverd = function (str) {
    return str.startsWith('$') || str.startsWith('_');
};

export const isElementNode = function isElementNode(node) {
    return node.nodeType === Node.ELEMENT_NODE;
};

export const isTextNode = function isTextNode(node) {
    return node.nodeType === Node.TEXT_NODE;
};

export const isDirective = function isDirective(attr) {
    return attr.startsWith('v-');
};

export const isEventDirective = function isEventDirective(attr) {
    return attr.startsWith('on');
};

export function makeMap(
    str: string,
    expectsLowerCase?: boolean
): (key: string) => boolean {
    const map: Record<string, boolean> = Object.create(null);
    const list: Array<string> = str.split(',');
    for (let i = 0; i < list.length; i++) {
        map[list[i]] = true;
    }
    return expectsLowerCase
        ? (val) => !!map[val.toLowerCase()]
        : (val) => !!map[val];
}

export const inBrowser =
    typeof window !== 'undefined' &&
    toTypeString.call(window) !== '[object Object]';

export const warn = function (msg) {
    console.warn('[Aue warn]: ' + msg);
};

export const query = function (el) {
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

export const nextFrame = function (fn) {
    window.requestAnimationFrame(() => {
        window.requestAnimationFrame(fn);
    });
};

export const nextTick = function (cb) {
    function handler() {
        cb();
    }
    // make a mutation observer
    const DOMObserver = new MutationObserver(handler);
    // make a node to trigger dom observer
    let tempText = 1;
    const tempNode = document.createTextNode(tempText.toString());
    DOMObserver.observe(tempNode, { characterData: true });
    // trigger the node change and the handler will run as microtask
    tempText = (tempText + 1) % 2;
    tempNode.data = tempText.toString();
};
