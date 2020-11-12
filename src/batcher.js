// seems not necessary to make batcher as a class
// maybe change later
const _ = require('./utils');

let queue = [];
let has = {};
// TODO: why need waiting and flushing as flags
let waiting = false;
let flushing = false;

function flush() {
    flushing = true;
    // run the queue
    for (let i = 0; i < queue.length; i++) {
        queue[i].run();
    }
    // reset
    queue = [];
    has = {};
    waiting = false;
    flushing = false;
}

module.exports.push = function (watcher) {
    // duplicate, ignore
    // NOTE: cannot use if(has[id]), because the first value may be 0
    if (has[watcher.id] !== undefined) return;
    // TODO: why need to mark queue.length?
    // blog says it's to prevent updating cycle
    queue.push(watcher);
    has[watcher.id] = queue.length;
    if (!waiting) {
        waiting = true;
        _.nextTick(flush);
    }
};
