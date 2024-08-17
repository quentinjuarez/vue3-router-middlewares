# vue3-router-middlewares

`vue3-router-middlewares` is a Vue 3 plugin for applying middleware functions to Vue Router navigation guards. It allows you to define and execute middleware functions before navigating to a route.

## Installation

To install the package, use npm or yarn:

```bash
npm install vue3-router-middlewares
# or
yarn add vue3-router-middlewares
```

## Usage

1. Import and Use the Plugin

Import the plugin and use it with your Vue app, passing the router instance as an option.

```javascript
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import Vue3RouterMiddlewares from "vue3-router-middlewares";

const app = createApp(App);

app.use(Vue3RouterMiddlewares, { router });
app.mount("#app");
```

2. Define Middlewares

Define your middleware functions. Middleware functions should be plain functions that accept `to`, `from`, and `next` as arguments.

```javascript
const middleware1 = (to, from, next) => {
  // Your logic here
  next();
};

const middleware2 = (to, from, next) => {
  // Your logic here
  next();
};
```

3. Attach Middlewares to Routes

Attach your middleware functions to routes using the `meta` property.

```javascript
const routes = [
  {
    path: "/protected",
    component: () => import("./components/Protected.vue"),
    meta: {
      middlewares: [middleware1, middleware2],
    },
  },
  // other routes
];
```

## TypeScript Definitions

The package includes TypeScript definitions. The RouteMeta interface is extended to include an optional middlewares property.

```typescript
import type {
  RouteLocationNormalized,
  NavigationGuardNext,
  NavigationGuard,
} from "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    middlewares?: NavigationGuard[];
  }
}
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
