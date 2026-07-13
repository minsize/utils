type Debounced<F extends (...args: any[]) => any> = ((
  ...args: Parameters<F>
) => void) & {
  cancel: () => void
  flush: () => ReturnType<F> | undefined
  pending: () => boolean
}

/**
 * Откладывает вызов функции до завершения паузы между вызовами.
 *
 * @example
 * const search = debounce((query: string) => loadResults(query), 250)
 * search("utils")
 * search.cancel()
 */
function debounce<F extends (...args: any[]) => any>(
  callback: F,
  delay: number,
): Debounced<F> {
  if (!Number.isFinite(delay) || delay < 0) {
    throw new RangeError("Delay must be a finite non-negative number.")
  }

  let timeoutId: ReturnType<typeof setTimeout> | undefined
  let lastArgs: Parameters<F> | undefined
  let lastThis: unknown
  let result: ReturnType<F> | undefined

  const invoke = (): ReturnType<F> | undefined => {
    if (!lastArgs) return result

    result = callback.apply(lastThis, lastArgs)
    lastArgs = undefined
    lastThis = undefined
    return result
  }

  const debounced = function (this: unknown, ...args: Parameters<F>): void {
    lastArgs = args
    lastThis = this

    if (timeoutId !== undefined) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      timeoutId = undefined
      invoke()
    }, delay)
  } as Debounced<F>

  debounced.cancel = () => {
    if (timeoutId !== undefined) clearTimeout(timeoutId)
    timeoutId = undefined
    lastArgs = undefined
    lastThis = undefined
  }

  debounced.flush = () => {
    if (timeoutId !== undefined) clearTimeout(timeoutId)
    timeoutId = undefined
    return invoke()
  }

  debounced.pending = () => timeoutId !== undefined

  return debounced
}

export default debounce
