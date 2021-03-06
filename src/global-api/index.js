import { nextTick } from '../utils';
import config from '../config';
import initExtend from './extend';
import { set, del } from '../observer/utils';
import builtInComponents from '../components/index';

export default function initGlobalAPI(Aue) {
    // config
    Object.defineProperty(Aue, 'config', {
        get: () => config,
        set: () => console.error('please do not replace config'),
    });

    // TODO:
    // Aue.util = util;

    Aue.set = set;
    Aue.delete = del;
    Aue.nextTick = nextTick;

    Aue.options = Object.create(null);
    config._assetTypes.forEach((type) => {
        Aue.options[type + 's'] = Object.create(null);
    });

    // transition
    Object.assign(Aue.options.components, builtInComponents);

    // initUse(Aue)
    // initMixin(Aue)
    initExtend(Aue);
    // initAssetRegisters(Aue)
}
