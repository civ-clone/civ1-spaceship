import Yield from '@civ-clone/core-yield/Yield';

export const reduceYieldWithUsed = (
  yields: Yield[],
  YieldType: typeof Yield
): [number, number] =>
  yields.reduce(
    ([provided, required], yieldValue) => {
      if (yieldValue instanceof YieldType && yieldValue.value() > 0) {
        provided += yieldValue.value();
      }

      if (yieldValue instanceof YieldType && yieldValue.value() < 0) {
        required += Math.abs(yieldValue.value());
      }

      return [provided, required];
    },
    [0, 0]
  );

export default reduceYieldWithUsed;
