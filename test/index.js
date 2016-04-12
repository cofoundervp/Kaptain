'use strict';

const test = require('tape');

test('A simple test', t => {
    setTimeout(() => {
        t.error(null, 'No error');
        t.end();
    }, 1000);
});

// Run API test
require('./api.test');