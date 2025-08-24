export const throttle = (func: Function, delay: number, { trailing, invert }: { trailing?: boolean; invert?: boolean }) => {
  let timeout: number | null = null;
  return (...args: any[]) => {
    if (invert) {
      if (timeout) {
        func(...args);
      } else {
        timeout = setTimeout(() => {
          timeout = null;
        }, delay);
      }
    } else {
      if (!timeout) {
        func(...args);
        timeout = setTimeout(() => {
          timeout = null;
          if (trailing) func(...args);
        }, delay);
      }
    }
  };
};
