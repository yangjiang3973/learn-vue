import config from '../config';
import { initExtend } from './extend';

module.exports.initGlobalAPI = function initGlobalAPI(Aue) {
    // config
    Object.defineProperty(Aue, 'config', {
        get: () => config,
        set: () => console.error('please do not replace config'),
    });

    // TODO:
    // Vue.util = util;
    // Vue.set = set;
    // Vue.delete = del;
    // Vue.nextTick = util.nextTick;

    Aue.options = Object.create(null);
    config._assetTypes.forEach((type) => {
        Aue.options[type + 's'] = Object.create(null);
    });

    // initUse(Vue)
    // initMixin(Vue)
    initExtend(Vue);
    // initAssetRegisters(Vue)
};
