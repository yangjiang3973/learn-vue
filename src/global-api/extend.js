//Vue.extend, so this points to Vue class

export default function initExtend(Aue) {
    Aue.extend = function extend(extendOptions) {
        const Sub = function AueComponent(options) {
            this._init(options);
        };

        Sub.prototype = Object.create(this.prototype);
        Sub.prototype.constructor = Sub;
        // Sub has Super's static options(Aue.options)! not options passed by consumers
        // TODO: change to mergeOptions, which will normalize props

        Sub.options = { ...extendOptions, ...Aue.options };
        console.log(
            '🚀 ~ file: extend.js ~ line 15 ~ extend ~ extendOptions',
            extendOptions
        );
        console.log(
            '🚀 ~ file: extend.js ~ line 15 ~ extend ~ extendOptions',
            Sub.options
        );
        const res = {};
        if (Array.isArray(Sub.options.props)) {
            Sub.options.props.forEach((element) => {
                res[element] = null;
            });
        }
        Sub.options.props = res;

        Sub['super'] = this;
        // allow further extension
        Sub.extend = this.extend; // this is super class

        return Sub;
    };
}
