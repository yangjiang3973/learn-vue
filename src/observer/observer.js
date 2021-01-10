import Dep from '../dep';
import {
    hasOwn,
    isArray,
    isObject,
    isPlainObject,
    isReserverd,
} from '../utils';

export default function observeData(data) {
    if (!isObject(data)) return;
    else if (hasOwn(data, '__ob__') && data.__ob__ instanceof Observer) {
        return data.__ob__;
    } else if (
        (isArray(data) || isPlainObject(data)) &&
        Object.isExtensible(data) &&
        !data._isAue
    ) {
        return new Observer(data);
    }
}

export class Observer {
    constructor(obj) {
        this.dep = new Dep(); // TODO: mabe init as null(if not vue's way)
        this.value = obj;
        obj['__ob__'] = this;
        if (isArray(obj)) {
            overrideArrayProto(obj, this.dep);
            this.observerArray(obj);
        } else {
            this.observeObj(obj);
        }
    }

    observeObj(obj) {
        Object.keys(obj).forEach((key) => {
            if (isReserverd(key)) return;
            defineReactive(obj, key, obj[key]);
        });
    }

    observerArray(arr) {
        arr.forEach((el) => {
            observeData(el);
        });
    }
}

export function defineReactive(obj, key, val) {
    // check if obj already has pre-defined getter/setter, need to keep
    let setter, getter;
    const property = Object.getOwnPropertyDescriptor(obj, key);
    if (property) {
        if (property.configurable === false) return;
        getter = property.get;
        setter = property.set;
    }

    let dep = new Dep();
    // if (obj[key] != null && typeof obj[key] === 'object') {
    //     // if this is array, fake proto first?
    //     const childOb = new Observer(obj[key]);
    //     childOb.dep = dep;
    //     if (Array.isArray(obj[key])) {
    //         overrideArrayProto(obj[key], childOb.dep);
    //     }
    // }
    let childOb = observeData(val);

    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get: function definedGet() {
            if (Dep.target) {
                dep.depend();
                if (childOb) childOb.dep.depend();
                if (isArray(val)) {
                    val.forEach((el) => {
                        if (el.__ob__ && el.__ob__.dep) el.__ob__.dep.depend();
                    });
                }
            }
            return getter ? getter.call(obj) : val;
        },
        set: function (newVal) {
            val = getter ? getter.call(obj) : val;
            if (newVal !== val) {
                if (setter) {
                    setter.call(obj, newVal);
                } else {
                    val = newVal;
                }
                // remove dep from the old val
                if (val && val.__ob__) {
                    val.__ob__.dep = null;
                }
                // if (newVal != null && typeof newVal === 'object') {
                //     let childOb;
                //     if (Array.isArray(newVal)) {
                //         childOb = observeData(newVal, arryType);
                //     } else {
                //         childOb = observeData(newVal);
                //     }
                //     childOb.dep = dep;
                // }
                childOb = observeData(newVal);
                dep.notify();
            }
        },
    });
    // include obj and array
    //* NOTE: here is the problem!!, access getter! but now the target is wrong
}

const OAM = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];

function overrideArrayProto(obj, dep) {
    const oldArr = obj.slice(0);
    const FakeProto = Object.create(Array.prototype);
    OAM.forEach((method) => {
        FakeProto[method] = function (...args) {
            const result = Array.prototype[method].apply(this, args);
            let inserted;
            switch (method) {
                case 'push':
                    inserted = args;
                    break;
                case 'unshift':
                    inserted = args;
                    break;
                case 'splice':
                    inserted = args.slice(2);
                    break;
            }
            if (inserted) {
                inserted.forEach((arg) => {
                    observeData(arg);
                });
            }
            dep.notify();
            return result;
        };
    }, this);

    Object.setPrototypeOf(obj, FakeProto);
}
