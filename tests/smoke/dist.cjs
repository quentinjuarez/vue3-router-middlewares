const assert = require('node:assert/strict');

const pkg = require('../../dist/cjs/index.js');

assert.equal(typeof pkg.default.install, 'function');
assert.equal(typeof pkg.applyMiddlewares, 'function');
