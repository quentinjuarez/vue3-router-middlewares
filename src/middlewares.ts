import type { NavigationGuard, NavigationGuardWithThis } from "vue-router";
import evaluateGuards from "./guards";

// Function to validate the middleware array
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

// Apply middlewares function
const applyMiddlewares: NavigationGuardWithThis<any> = (to, from, next) => {
  const allMiddlewares: NavigationGuard[] = [];

  if (!to.matched?.length) {
    return next();
  }

  for (const record of to.matched) {
    if (record.meta?.middlewares) {
      const validGuards = checkMiddlewaresValidity(record.meta.middlewares);
      allMiddlewares.push(...validGuards);
    }
  }

  if (allMiddlewares.length === 0) {
    return next();
  }

  return evaluateGuards(allMiddlewares, to, from, next);
};

export default applyMiddlewares;
