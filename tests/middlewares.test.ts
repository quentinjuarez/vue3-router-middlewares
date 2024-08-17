import applyMiddlewares from "../src/middlewares";
import type { RouteLocationNormalized, NavigationGuardNext } from "vue-router";

describe("applyMiddlewares", () => {
  it("should throw an error if middlewares are not an array", () => {
    const to = {
      meta: { middlewares: "not-an-array" },
    } as unknown as RouteLocationNormalized;
    const from = {} as RouteLocationNormalized;
    const next = jest.fn() as NavigationGuardNext;

    expect(() => applyMiddlewares(to, from, next)).toThrow(
      "vue3-router-middlewares: Middlewares should be an array"
    );
  });

  it("should throw an error if any middleware is not a function", () => {
    const to = {
      meta: { middlewares: [() => {}, "not-a-function"] },
    } as unknown as RouteLocationNormalized;
    const from = {} as RouteLocationNormalized;
    const next = jest.fn() as NavigationGuardNext;

    expect(() => applyMiddlewares(to, from, next)).toThrow(
      "vue3-router-middlewares: Middleware should be a function"
    );
  });

  it("should call the middlewares in sequence", () => {
    const middleware1 = jest.fn((to, from, next) => next());
    const middleware2 = jest.fn((to, from, next) => next());

    const to = {
      meta: { middlewares: [middleware1, middleware2] },
    } as unknown as RouteLocationNormalized;
    const from = {} as RouteLocationNormalized;
    const next = jest.fn() as NavigationGuardNext;

    applyMiddlewares(to, from, next);

    expect(middleware1).toHaveBeenCalled();
    expect(middleware2).toHaveBeenCalled();
  });

  it("should call the next function if there are no middlewares", () => {
    const to = {
      meta: {},
    } as unknown as RouteLocationNormalized;
    const from = {} as RouteLocationNormalized;
    const next = jest.fn() as NavigationGuardNext;

    applyMiddlewares(to, from, next);

    expect(next).toHaveBeenCalled();
  });
});
