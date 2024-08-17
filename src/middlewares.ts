import type {
  RouteLocationNormalized,
  NavigationGuardNext,
  NavigationGuard,
} from "vue-router";
import evaluateGuards from "./guards";

const checkMiddlewaresValidity = (middlewares: NavigationGuard[]) => {
  if (!Array.isArray(middlewares)) {
    throw new Error("vue3-router-middlewares: Middlewares should be an array");
  }

  middlewares.forEach((middleware) => {
    if (typeof middleware !== "function") {
      throw new Error(
        "vue3-router-middlewares: Middleware should be a function"
      );
    }
  });

  return middlewares;
};

const applyMiddlewares: NavigationGuard = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  if (!to.meta.middlewares) {
    return next();
  }

  const guards = checkMiddlewaresValidity(to.meta.middlewares);

  return evaluateGuards(guards, to, from, next);
};

export default applyMiddlewares;
