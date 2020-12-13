const { Aue } = require('../src/aue');
const { Observer, observeData } = require('../src/observer/observer');

// module.exports = class ClassComp extends Aue {
class ClassComp {
    constructor() {
        this.data = {};
        this.data.localState = 'local state!';
        this._watcherList = [];
        observeData(this.data);
    }
    changeLocal() {
        this.data.localState = this.props.msg;
    }
    render(h) {
        return (
            <button onClick={this.changeLocal}>{this.data.localState}</button>
        );
    }
}

// should use extends later
ClassComp.prototype.__patch__ = Aue.prototype.__patch__;
module.exports = ClassComp;
