'use strict';

if (process.env.NODE_ENV === 'production') {
    console.log('sb');
    module.exports = require('./dist/vue.cjs.prod.js');
} else {
    console.log('sb2');

    module.exports = require('./dist/vue.cjs.js');
}
