import config from '../config';
import initExtend from './extend';

export default function initGlobalAPI(Aue) {
    // config
    Object.defineProperty(Aue, 'config', {
        get: () => config,
        set: () => console.error('please do not replace config'),
    });

    // TODO:
    // Aue.util = util;
    // TODO: temp solution, need to polish again
    // Aue.set = function set(obj, key, val) {
    //     console.log('!!!!!', obj);
    //     if (Array.isArray(obj)) {
    //         obj.splice(key, 1, val);
    //         return val;
    //     }
    //     if (obj.hasOwnProperty(key)) {
    //         obj[key] = val;
    //         return;
    //     }
    //     const ob = obj.__ob__;
    //     if (!ob) {
    //         obj[key] = val;
    //         return;
    //     }
    //     ob.defineReactive(ob.value, key, val);
    //     ob.dep.notify();
    //     return val;
    // };
    // Aue.delete = del;
    // Aue.nextTick = util.nextTick;

    Aue.options = Object.create(null);
    config._assetTypes.forEach((type) => {
        Aue.options[type + 's'] = Object.create(null);
    });

    // initUse(Aue)
    // initMixin(Aue)
    initExtend(Aue);
    // initAssetRegisters(Aue)
}
