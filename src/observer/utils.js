import { defineReactive } from '../observer/observer';
import { isArray, hasOwn } from '../utils';

export function set(obj, key, val) {
    if (isArray(obj)) {
        obj.splice(key, 1, val);
        return val;
    }
    if (hasOwn(obj, key)) {
        obj[key] = val;
        return;
    }
    const ob = obj.__ob__;
    if (!ob) {
        obj[key] = val;
        return;
    }
    defineReactive(ob.value, key, val);
    ob.dep.notify();
    return val;
}

export function del(obj, key) {
    const ob = obj.__ob__;
    if (!hasOwn(obj, key)) {
        return;
    }
    delete obj[key];
    if (!ob) {
        return;
    }
    ob.dep.notify();
}
