export const throttle = (func: Function, delay: number, trailing?: boolean) => {
  let timeout: number | null = null;
  return (...args: any[]) => {
    if (!timeout) {
      func(...args);
      timeout = setTimeout(() => {
        timeout = null;
        if (trailing) func(...args);
      }, delay);
    }
  };
};
