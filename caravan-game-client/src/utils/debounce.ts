export const debounce = <T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  waitFor: number,
) => {
  let timeout: NodeJS.Timeout;

  const debounced = (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), waitFor);
  };

  return debounced;
};
