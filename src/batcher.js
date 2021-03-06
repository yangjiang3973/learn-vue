// seems not necessary to make batcher as a class
// maybe change later
import { warn, nextTick } from './utils';

import config from '../src/config';

let queue = [];
let userQueue = [];
let has = {};
// TODO: why need waiting and flushing as flags
let waiting = false;
let flushing = false;
let circular = {};

function runQueue(queue) {
    for (let i = 0; i < queue.length; i++) {
        const watcher = queue[i];
        has[watcher.id] = null;
        watcher.run();
        // NOTE: why only check circle in dev mode
        if (process.env.NODE_ENV !== 'production' && has[watcher.id] !== null) {
            circular[watcher.id] = (circular[watcher.id] || 0) + 1;
            if (circular[watcher.id] > config._maxUpdateCount) {
                warn(`You may have an infinite update loop for watcher`);
                break;
            }
        }
    }
    queue.length = 0;
}

function flush() {
    flushing = true;
    // run the queue
    runQueue(queue);
    runQueue(userQueue);
    // element in userQueue may add more job to the directive queue
    if (queue.length) return flush();
    // reset
    queue = [];
    userQueue = [];
    has = {};
    waiting = false;
    flushing = false;
    circular = {};
}

export const queueWatcher = function (watcher) {
    // NOTE: cannot use if(has[id]), because the first value may be 0
    // NOTE: when flushing is true, allow duplicate..I still do not understand
    // maybe only in 0.11? 1.0 is different?
    if (has[watcher.id] !== undefined && flushing === false) return;

    // A user watcher callback could trigger another
    // directive update during the flushing; at that time
    // the directive queue would already have been run, so
    // we call that update immediately as it is pushed.
    // if (flushing && !watcher.user) {
    //     watcher.run();
    //     return;
    // }
    const q = watcher.user ? userQueue : queue;
    // TODO: why need to mark queue.length?
    // blog says it's to prevent updating cycle
    has[watcher.id] = q.length;
    q.push(watcher);
    if (!waiting) {
        waiting = true;
        nextTick(flush);
    }
};
