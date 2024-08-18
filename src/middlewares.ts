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
const applyMiddlewares: NavigationGuardWithThis<undefined> = (
  to,
  from,
  next
) => {
  if (!to.meta.middlewares) {
    return next();
  }

  const guards = checkMiddlewaresValidity(to.meta.middlewares);

  return evaluateGuards(guards, to, from, next);
};

export default applyMiddlewares;
