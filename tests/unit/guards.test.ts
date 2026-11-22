import { describe, it, expect, vi } from 'vitest';
import type { NavigationGuard, RouteLocationNormalized } from 'vue-router';

import evaluateGuards from '../../src/guards';

describe('evaluateGuards', () => {
  it('should call next() if no guards are left', () => {
    const next = vi.fn();

    evaluateGuards(
      [],
      {} as RouteLocationNormalized,
      {} as RouteLocationNormalized,
      next,
    );

    expect(next).toHaveBeenCalled();
  });

  it('should call the guards in order', () => {
    const guard1 = vi.fn((to, from, next) => next());
    const guard2 = vi.fn((to, from, next) => next());

    const next = vi.fn();
    const guards: NavigationGuard[] = [guard1, guard2];

    evaluateGuards(
      guards,
      {} as RouteLocationNormalized,
      {} as RouteLocationNormalized,
      next,
    );

    expect(guard1).toHaveBeenCalled();
    expect(guard2).toHaveBeenCalled();
    expect(next).toHaveBeenCalled();
  });

  it('should stop if a guard passes an argument to next()', () => {
    const guard1 = vi.fn((to, from, next) => next('stop'));
    const guard2 = vi.fn();

    const next = vi.fn();
    const guards: NavigationGuard[] = [guard1, guard2];

    evaluateGuards(
      guards,
      {} as RouteLocationNormalized,
      {} as RouteLocationNormalized,
      next,
    );

    expect(guard1).toHaveBeenCalled();
    expect(guard2).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith('stop');
  });

  it('should keep the navigation blocked when a guard calls next(false)', () => {
    const guard1 = vi.fn((to, from, next) => next(false));
    const guard2 = vi.fn();

    const next = vi.fn();

    evaluateGuards(
      [guard1, guard2],
      {} as RouteLocationNormalized,
      {} as RouteLocationNormalized,
      next,
    );

    expect(guard2).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(false);
  });

  it('should forward a redirect passed to next()', () => {
    const guard1 = vi.fn((to, from, next) => next('/login'));
    const guard2 = vi.fn();

    const next = vi.fn();

    evaluateGuards(
      [guard1, guard2],
      {} as RouteLocationNormalized,
      {} as RouteLocationNormalized,
      next,
    );

    expect(guard2).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith('/login');
  });

  it('should continue the chain on next(undefined)', () => {
    const guard1 = vi.fn((to, from, next) => next(undefined));
    const guard2 = vi.fn((to, from, next) => next());

    const next = vi.fn();

    evaluateGuards(
      [guard1, guard2],
      {} as RouteLocationNormalized,
      {} as RouteLocationNormalized,
      next,
    );

    expect(guard2).toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  it('should ignore calls to next() after the first one', () => {
    const guard1 = vi.fn((to, from, next) => {
      next();
      next();
      next('/login');
    });
    const guard2 = vi.fn((to, from, next) => next());

    const next = vi.fn();

    evaluateGuards(
      [guard1, guard2],
      {} as RouteLocationNormalized,
      {} as RouteLocationNormalized,
      next,
    );

    expect(guard2).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  it('should pass a synchronous error to next()', () => {
    const error = new Error('boom');
    const guard1 = vi.fn(() => {
      throw error;
    });
    const guard2 = vi.fn();

    const next = vi.fn();

    evaluateGuards(
      [guard1, guard2],
      {} as RouteLocationNormalized,
      {} as RouteLocationNormalized,
      next,
    );

    expect(guard2).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('should pass a rejected promise to next()', async () => {
    const error = new Error('boom');
    const guard1 = vi.fn(async () => {
      throw error;
    });
    const guard2 = vi.fn();

    const next = vi.fn();

    evaluateGuards(
      [guard1, guard2],
      {} as RouteLocationNormalized,
      {} as RouteLocationNormalized,
      next,
    );

    await vi.waitFor(() => expect(next).toHaveBeenCalled());

    expect(guard2).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(error);
  });

  it('should log an error thrown after next() without calling next() again', () => {
    const error = new Error('late');
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const guard1 = vi.fn((to, from, next) => {
      next();
      throw error;
    });

    const next = vi.fn();

    evaluateGuards(
      [guard1],
      {} as RouteLocationNormalized,
      {} as RouteLocationNormalized,
      next,
    );

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
    expect(consoleError).toHaveBeenCalledWith(
      'vue3-router-middlewares:',
      error,
    );
    consoleError.mockRestore();
  });

  it('should log a rejection after next() without calling next() again', async () => {
    const error = new Error('late');
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const guard1 = vi.fn(async (to, from, next) => {
      next();
      throw error;
    });

    const next = vi.fn();

    evaluateGuards(
      [guard1],
      {} as RouteLocationNormalized,
      {} as RouteLocationNormalized,
      next,
    );

    await vi.waitFor(() => expect(consoleError).toHaveBeenCalled());

    expect(next).toHaveBeenCalledTimes(1);
    expect(consoleError).toHaveBeenCalledWith(
      'vue3-router-middlewares:',
      error,
    );
    consoleError.mockRestore();
  });

  it('should pass the rejection of a thenable to next()', async () => {
    const error = new Error('boom');
    const thenable = {
      then: (_resolve: unknown, reject: (reason: unknown) => void) =>
        reject(error),
    };
    const guard1 = vi.fn(() => thenable);

    const next = vi.fn();

    evaluateGuards(
      [guard1 as unknown as NavigationGuard],
      {} as RouteLocationNormalized,
      {} as RouteLocationNormalized,
      next,
    );

    await vi.waitFor(() => expect(next).toHaveBeenCalled());

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(error);
  });

  it.each([null, 0, ''])(
    'should forward next(%j) untouched to vue-router',
    (value) => {
      const guard1 = vi.fn((to, from, next) => next(value));
      const guard2 = vi.fn();

      const next = vi.fn();

      evaluateGuards(
        [guard1, guard2],
        {} as RouteLocationNormalized,
        {} as RouteLocationNormalized,
        next,
      );

      expect(guard2).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(value);
    },
  );
});
