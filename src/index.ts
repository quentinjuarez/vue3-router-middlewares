import type { App } from "vue";
import type { Router } from "vue-router";
import applyMiddlewares from "./middlewares";

export default {
  install(_app: App, options: { router: Router }) {
    if (!options.router) {
      throw new Error("vue3-router-middlewares: Router is required");
    }

    options.router.beforeEach(applyMiddlewares);
  },
};

export { applyMiddlewares };
