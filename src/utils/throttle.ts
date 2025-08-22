export const throttle = (func: Function, delay: number) => {
  let timeout: number | null = null;
  return (...args: any[]) => {
    if (!timeout) {
      func(...args);
      timeout = setTimeout(() => {
        timeout = null;
      }, delay);
    }
  };
};
