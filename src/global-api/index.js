import { isArray, hasOwn, nextTick } from '../utils';
import config from '../config';
import initExtend from './extend';
import { defineReactive } from '../observer/observer';
import builtInComponents from '../components/index';

export default function initGlobalAPI(Aue) {
    // config
    Object.defineProperty(Aue, 'config', {
        get: () => config,
        set: () => console.error('please do not replace config'),
    });

    // TODO:
    // Aue.util = util;

    Aue.set = function set(obj, key, val) {
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
    };
    Aue.delete = function del(obj, key) {
        const ob = obj.__ob__;
        if (!hasOwn(obj, key)) {
            return;
        }
        delete obj[key];
        if (!ob) {
            return;
        }
        ob.dep.notify();
    };
    Aue.nextTick = nextTick;

    Aue.options = Object.create(null);
    config._assetTypes.forEach((type) => {
        Aue.options[type + 's'] = Object.create(null);
    });

    // transition
    Object.assign(Aue.options.components, builtInComponents);
    console.log(
        '🚀 ~ file: index.js ~ line 55 ~ initGlobalAPI ~ Aue.options.components',
        Aue.options.components
    );

    // initUse(Aue)
    // initMixin(Aue)
    initExtend(Aue);
    // initAssetRegisters(Aue)
}
