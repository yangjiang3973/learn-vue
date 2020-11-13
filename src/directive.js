const { Watcher } = require('./watcher');
const { Dep } = require('./dep');
const _ = require('./utils');

class Directive {
    constructor(name, el, vm, descriptors, def) {
        this.name = name;
        this.el = el;
        this.vm = vm;
        this.raw = descriptors.raw;
        this.expression = descriptors.expression;
        this.filters = descriptors.filters;
        this._bind(def);
    }

    _bind(def) {
        if (_.isElementNode(this.el)) this.el.removeAttribute('v-' + this.name);

        this.bind = def.bind;
        this.update = def.update; // TODO: use `_.extend like vue`
        this.bind();
        if (!def.isLiteral) {
            this._watcherExp = this.expression;
            const update = function (val, oldVal) {
                this.update(val, oldVal);
            }.bind(this);
            const watcher = new Watcher(
                this.vm,
                this._watcherExp,
                update, // callback
                {
                    filters: this.filters,
                } // later for filter and other features
            );
            // Dep.target = watcher; // NOTE: right now set here, maybe change later
            this.update(watcher.value);
            // watcher.update(this.vm[this.expression]);
            // watcher.update();
            // TODO: temp solution
            // watcher.initUpdate();
            // Dep.target = null;
        }
    }
}

module.exports.Directive = Directive;
