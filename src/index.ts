import type { App, Plugin } from "vue";
import type { Router } from "vue-router";
import applyMiddlewares from "./middlewares";

// Define the plugin properly as a Plugin type
const Vue3RouterMiddlewares: Plugin<{ router: Router }> = {
  install(_app: App, options?: { router: Router }) {
    if (!options || !options.router) {
      throw new Error("vue3-router-middlewares: Router is required");
    }

    options.router.beforeEach(applyMiddlewares);
  },
};

export default Vue3RouterMiddlewares;
export { applyMiddlewares };
