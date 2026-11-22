import type {
  NavigationGuardWithThis,
  RouteLocationNormalized,
  NavigationGuardNext,
} from 'vue-router';

function evaluateGuards(
  guards: NavigationGuardWithThis<any>[],
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) {
  const guardsLeft = guards.slice(0); // Clone the array
  const nextGuard = guardsLeft.shift();

  if (!nextGuard) {
    next();
    return;
  }

  let settled = false;

  const applyNext = (nextArg?: any) => {
    if (settled) return;
    settled = true;

    if (nextArg === undefined) {
      evaluateGuards(guardsLeft, to, from, next);
      return;
    }

    next(nextArg);
  };

  const fail = (error: unknown) => {
    if (settled) {
      console.error('vue3-router-middlewares:', error);
      return;
    }
    settled = true;
    next(error as Error);
  };

  try {
    const result: unknown = nextGuard(
      to,
      from,
      applyNext as NavigationGuardNext,
    );
    if (
      typeof (result as PromiseLike<unknown> | undefined)?.then === 'function'
    ) {
      Promise.resolve(result).catch(fail);
    }
  } catch (error) {
    fail(error);
  }
}

export default evaluateGuards;
