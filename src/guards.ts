import type {
  NavigationGuardWithThis,
  RouteLocationNormalized,
  NavigationGuardNext,
} from "vue-router";

function evaluateGuards(
  guards: NavigationGuardWithThis<any>[],
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) {
  const guardsLeft = guards.slice(0); // Clone the array
  const nextGuard = guardsLeft.shift();

  if (!nextGuard) {
    next();
    return;
  }

  const applyNext = (nextArg: any) => {
    if (!nextArg) {
      evaluateGuards(guardsLeft, to, from, next);
      return;
    }

    next(nextArg);
  };

  nextGuard(to, from, applyNext as NavigationGuardNext);
}

export default evaluateGuards;
