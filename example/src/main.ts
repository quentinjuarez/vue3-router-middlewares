import { createApp } from "vue";
import App from "./App.vue";
import { createRouter, createWebHistory, NavigationGuard } from "vue-router";
import Vue3RouterMiddlewares from "vue3-router-middlewares";

const middleware: NavigationGuard = (to, from, next) => {
  console.log("Home Middleware");
  next();
};

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("./Home.vue"),
      meta: {
        middlewares: [middleware],
      },
    },
  ],
});

const app = createApp(App);
app.use(router);
app.use(Vue3RouterMiddlewares, {
  router,
});

app.mount("#app");
