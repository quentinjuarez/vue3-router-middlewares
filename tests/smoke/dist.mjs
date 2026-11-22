import assert from 'node:assert/strict';

import Vue3RouterMiddlewares, {
  applyMiddlewares,
} from '../../dist/esm/index.js';

assert.equal(typeof Vue3RouterMiddlewares.install, 'function');
assert.equal(typeof applyMiddlewares, 'function');
