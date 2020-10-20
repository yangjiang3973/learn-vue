const { Watcher } = require('./watcher');
const { Dep } = require('./dep');

class Directive {
    constructor(name, el, vm, descriptors, def) {
        this.name = name;
        this.el = el;
        this.vm = vm;
        this.raw = descriptors.raw;
        this.expression = descriptors.expression;
        this._bind(def);
    }

    _bind(def) {
        this.el.removeAttribute('v-' + this.name);
        this.bind = def.bind;
        this.update = def.update; // TODO: use `_.extend like vue`
        console.log('aaaa');
        this.bind();
        this._watcherExp = this.expression;
        const update = function (val, oldVal) {
            this.update(val, oldVal); // TODO: need to bind this?
        }.bind(this);
        const watcher = new Watcher(
            this.vm,
            this._watcherExp,
            update, // callback
            {} // later for filter and other features
        );
        Dep.target = watcher; // NOTE: right now set here, maybe change later
        this.update(this.vm[this.expression]);
    }
}

module.exports.Directive = Directive;
