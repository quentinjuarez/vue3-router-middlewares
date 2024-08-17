export {};

declare module "vue-router" {
  interface RouteMeta {
    middlewares?: NavigationGuard[];
  }
}
