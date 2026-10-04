export const cleanableDebounce = <Args extends unknown[]>(
  func: (...args: Args) => void,
  wait: number
) => {
  let timeout: ReturnType<typeof setTimeout> | null

  const clear = () => {
    if (timeout !== null) {
      clearTimeout(timeout)
    }
  }

  return {
    func: (...args: Args): void => {
      clear()
      timeout = setTimeout(() => {
        func(...args)
      }, wait)
    },
    clear,
  }
}

export const debounce = <Args extends unknown[]>(
  func: (...args: Args) => void,
  wait: number
): ((...args: Args) => void) => {
  return cleanableDebounce(func, wait).func
}
