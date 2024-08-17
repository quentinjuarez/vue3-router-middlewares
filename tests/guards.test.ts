import evaluateGuards from "../src/guards";
import type { NavigationGuard, RouteLocationNormalized } from "vue-router";

describe("evaluateGuards", () => {
  it("should call next() if no guards are left", () => {
    const next = jest.fn();
    evaluateGuards(
      [],
      {} as RouteLocationNormalized,
      {} as RouteLocationNormalized,
      next
    );

    expect(next).toHaveBeenCalled();
  });

  it("should call the guards in order", () => {
    const guard1 = jest.fn((to, from, next) => next());
    const guard2 = jest.fn((to, from, next) => next());

    const next = jest.fn();
    const guards: NavigationGuard[] = [guard1, guard2];

    evaluateGuards(
      guards,
      {} as RouteLocationNormalized,
      {} as RouteLocationNormalized,
      next
    );

    expect(guard1).toHaveBeenCalled();
    expect(guard2).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it("should stop if a guard passes an argument to next()", () => {
    const guard1 = jest.fn((to, from, next) => next("stop"));
    const guard2 = jest.fn();

    const next = jest.fn();
    const guards: NavigationGuard[] = [guard1, guard2];

    evaluateGuards(
      guards,
      {} as RouteLocationNormalized,
      {} as RouteLocationNormalized,
      next
    );

    expect(guard1).toHaveBeenCalled();
    expect(guard2).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith("stop");
  });
});
