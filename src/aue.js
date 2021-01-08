import { initMixin } from './instance/init';
import { stateMixin } from './instance/state';
import { eventsMixin } from './instance/events';
import { lifecycleMixin } from './instance/lifecycle';
import { renderMixin } from './instance/render';
import patch from './vdom/patch';
import { query } from './utils';

import initGlobalAPI from './global-api/index';

class Aue {
    constructor(options) {
        this._init(options);
        // this._directives = []; // all directives
        // this._userWatchers = {}; // user watchers as a hash
    }

    // should move to `initAssetRegisters`
    static component(id, def) {
        if (!def) {
            return this.options['components'][id];
        } else {
            this.options['components'][id] = def;
        }
    }

    static directive(id, def) {
        if (!def) {
            return this.options['directives'][id]; // this.options is static
        } else {
            this.options['directives'][id] = def;
        }
    }

    static filter(id, def) {
        if (!def) {
            return this.options['filters'][id];
        } else {
            this.options['filters'][id] = def;
        }
    }

    _unproxyData(key) {
        delete this[key];
    }

    _digest = function () {
        this._watcherList.forEach((watcher) => {
            watcher.update();
        });
        //TODO: also need to update children, need to keep an array of children of vms
    };
}

initMixin(Aue);
stateMixin(Aue);
// TODO: eventMixin: $on, $once, $off, $emit
eventsMixin(Aue);
lifecycleMixin(Aue);
renderMixin(Aue);

initGlobalAPI(Aue);

Aue.prototype.$mount = function (el, hydrating) {
    // el = el && !config._isServer ? query(el) : undefined
    el = query(el);
    return this._mount(el, hydrating);
};

Aue.prototype.__patch__ = patch;

// Object.assign(Aue, require('./global-api/extend'));

export default Aue;
