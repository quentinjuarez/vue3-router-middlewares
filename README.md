# vue3-router-middlewares

Apply middleware functions to Vue Router navigation through route `meta` fields,
including middlewares inherited from parent routes.

[![npm version](https://img.shields.io/npm/v/vue3-router-middlewares)](https://www.npmjs.com/package/vue3-router-middlewares)
[![npm downloads](https://img.shields.io/npm/dm/vue3-router-middlewares)](https://www.npmjs.com/package/vue3-router-middlewares)
[![license](https://img.shields.io/npm/l/vue3-router-middlewares)](LICENSE)

Works with Vue 3 and Vue Router 4 or 5.

## Installation

```bash
yarn add vue3-router-middlewares
# or
npm install vue3-router-middlewares
```

`vue` and `vue-router` are peer dependencies, so your project's own versions are
used.

## Usage

Register the plugin with your router instance:

```ts
import { createApp } from 'vue';
import Vue3RouterMiddlewares from 'vue3-router-middlewares';

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(Vue3RouterMiddlewares, { router });
app.mount('#app');
```

Then declare middlewares on any route through `meta.middlewares`:

```ts
const requireAuth = (to, from, next) => {
  if (!isLoggedIn()) return next('/login');
  next();
};

const requireAdmin = (to, from, next) => {
  if (!isAdmin()) return next(false);
  next();
};

const routes = [
  {
    path: '/admin',
    component: () => import('./Admin.vue'),
    meta: { middlewares: [requireAuth, requireAdmin] },
  },
];
```

## How middlewares run

- Middlewares are collected from **every matched route record**, so a middleware
  declared on a parent route also runs for its children. Parents run first.
- They run in sequence. Calling `next()` with no argument hands over to the next
  middleware, and once the last one calls `next()` the navigation proceeds.
- Calling `next()` with any argument short-circuits the chain and hands the value
  straight to Vue Router, so `next('/login')` redirects and `next(false)` aborts.
- A route with no middlewares navigates without any extra work.

## API

### `Vue3RouterMiddlewares`

The default export, a Vue plugin. It requires a `{ router }` option and throws
`vue3-router-middlewares: Router is required` if it is missing. It registers a
single `router.beforeEach` guard.

### `applyMiddlewares`

The navigation guard itself, exported for cases where you would rather wire it up
yourself instead of installing the plugin:

```ts
import { applyMiddlewares } from 'vue3-router-middlewares';

router.beforeEach(applyMiddlewares);
```

It throws if `meta.middlewares` is not an array, or if any entry is not a
function.

## TypeScript

The package ships a module augmentation that adds `middlewares` to Vue Router's
`RouteMeta`. Either reference the shipped declaration once in your project:

```ts
import 'vue3-router-middlewares/src/types.d.ts';
```

Or declare it yourself:

```ts
import type { NavigationGuard } from 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    middlewares?: NavigationGuard[];
  }
}
```

## Development

```bash
yarn install
yarn verify      # lint, format check, typecheck, tests, build
yarn test:watch
```

## Releasing

Releases are driven by the commit messages. Push to `main` and CI decides
whether to publish, from the Conventional Commit prefixes in that push:

| Commit                                           | Release |
| ------------------------------------------------ | ------- |
| `feat!:`, or a `BREAKING CHANGE:` footer         | major   |
| `feat:`                                          | minor   |
| `fix:`, `perf:`                                  | patch   |
| `chore:`, `docs:`, `ci:`, `test:`, anything else | none    |

The highest bump in the push wins. CI runs `yarn verify`, publishes to npm,
then commits the version bump and tags it. Nothing to run by hand, and no
version is bumped by a commit that does not change the published code.

To publish without a qualifying commit, run the workflow manually and pick a
strategy. `current` publishes the version already in `package.json`, which is
what a first release or a retry after a credentials failure needs.

```bash
gh workflow run CI --field strategy=minor
```

## License

MIT. See [LICENSE](LICENSE).
