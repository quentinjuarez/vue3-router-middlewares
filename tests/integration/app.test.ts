import { describe, it, expect, vi, beforeEach } from "vitest";
import { createRouter, createMemoryHistory } from "vue-router";
import { mount } from "@vue/test-utils";
import { defineComponent } from "vue";
import applyMiddlewares from "../../src/middlewares";

// Middleware mock
const protectedMiddleware = vi.fn((_to, _from, next) => next());
const parentMiddleware = vi.fn((_to, _from, next) => next());
const childMiddleware = vi.fn((_to, _from, next) => next());

// Component mock
const TestComponent = defineComponent({
  template: "<div>Test Page</div>",
});

const ParentComponent = defineComponent({
  template: "<div>Parent Page <router-view /></div>",
});

// Define routes with middleware
const routes = [
  {
    path: "/",
    component: TestComponent,
  },
  {
    path: "/protected",
    component: TestComponent,
    meta: {
      middlewares: [protectedMiddleware],
    },
  },
  {
    path: "/parent",
    component: ParentComponent,
    meta: {
      middlewares: [parentMiddleware],
    },
    children: [
      {
        path: "child",
        component: TestComponent,
        meta: {
          middlewares: [childMiddleware],
        },
      },
    ],
  },
];

let router: ReturnType<typeof createRouter>;

beforeEach(() => {
  router = createRouter({
    history: createMemoryHistory(),
    routes,
  });

  router.beforeEach(applyMiddlewares);
});

describe("Navigation with middlewares", () => {
  it("should call middleware on route with meta.middlewares", async () => {
    const wrapper = mount(TestComponent, {
      global: {
        plugins: [router],
      },
    });

    // Start navigation
    await router.push("/protected");
    await router.isReady();

    expect(protectedMiddleware).toHaveBeenCalled();
    expect(wrapper.html()).toContain("Test Page");
  });

  it("should not call middleware on route without meta.middlewares", async () => {
    protectedMiddleware.mockClear();

    const wrapper = mount(TestComponent, {
      global: {
        plugins: [router],
      },
    });

    await router.push("/");
    await router.isReady();

    expect(protectedMiddleware).not.toHaveBeenCalled();
    expect(wrapper.html()).toContain("Test Page");
  });

  it("should call parent middleware before child middleware", async () => {
    const wrapper = mount(ParentComponent, {
      global: {
        plugins: [router],
      },
    });

    await router.push("/parent/child");
    await router.isReady();

    expect(parentMiddleware).toHaveBeenCalledBefore(childMiddleware);

    expect(wrapper.html()).toContain("Parent Page");
    expect(wrapper.html()).toContain("Test Page");
  });
});
