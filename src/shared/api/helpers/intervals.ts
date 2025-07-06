/**
 * Creates a throttled version of a function that, when invoked repeatedly,
 * will only call the original function at most once every `delay` milliseconds.
 *
 * You can control whether the function is invoked on the leading and/or trailing
 * edge of the delay interval using the `options` object.
 *
 * T - The types of the arguments the throttled function will accept.
 *
 * @param callback - The function to throttle.
 * @param delay - The number of milliseconds to throttle invocations to.
 * @param options - Configuration object:
 *  - `leading` (default: `true`) — whether to invoke on the leading edge of the delay interval.
 *  - `trailing` (default: `true`) — whether to invoke on the trailing edge of the delay interval.
 *
 * @returns A throttled version of the input function.
 *
 * @example
 * const throttled = throttleTime(() =\> console.log('Hi'), 1000, \{ leading: true, trailing: true \});
 * window.addEventListener('scroll', throttled);
 */
export function throttleTime<T extends unknown[]>(
  callback: (...args: T) => unknown,
  delay: number,
  options: { leading?: boolean; trailing?: boolean } = {},
): (...args: T) => void {
  const { leading = true, trailing = true } = options;
  let lastArgs: T | null = null;
  let called = false;
  let lastThis: unknown;
  return function (this: unknown, ...args: T): void {
    lastThis = this;
    lastArgs = args;

    if (called) {
      return;
    }
    called = true;
    setTimeout(() => {
      called = false;
      if (trailing && (lastArgs !== args || !leading)) {
        callback.apply(lastThis, lastArgs as T);
      }
    }, delay);
    if (leading) {
      callback.apply(lastThis, lastArgs);
    }
  };
}
