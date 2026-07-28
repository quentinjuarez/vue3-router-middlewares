import type { NavigationGuard } from 'vue-router';

// A module augmentation does not inherit the augmented module's scope, so
// NavigationGuard has to be imported explicitly for this to compile.
declare module 'vue-router' {
  interface RouteMeta {
    middlewares?: NavigationGuard[];
  }
}
