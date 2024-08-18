import type { App, ObjectPlugin } from "vue";
import type { Router } from "vue-router";
import applyMiddlewares from "./middlewares";

// Define the plugin properly as a Plugin type
const Vue3RouterMiddlewares: ObjectPlugin<{ router: Router }> = {
  install(_app: App, ...options: any[]) {
    const [pluginOptions] = options as [{ router: Router }];

    if (!pluginOptions || !pluginOptions.router) {
      throw new Error("vue3-router-middlewares: Router is required");
    }

    pluginOptions.router.beforeEach(applyMiddlewares);
  },
};

export default Vue3RouterMiddlewares;
export { applyMiddlewares };
