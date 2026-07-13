type Throttled<F extends (...args: any[]) => any> = ((
  ...args: Parameters<F>
) => void) & {
  cancel: () => void
  flush: () => ReturnType<F> | undefined
  pending: () => boolean
}

/**
 * Ограничивает частоту вызова функции, сохраняя последний вызов для конца интервала.
 *
 * @example
 * const onScroll = throttle(() => updateHeader(), 100)
 * window.addEventListener("scroll", onScroll)
 */
function throttle<F extends (...args: any[]) => any>(
  callback: F,
  delay: number,
): Throttled<F> {
  if (!Number.isFinite(delay) || delay < 0) {
    throw new RangeError("Delay must be a finite non-negative number.")
  }

  let timeoutId: ReturnType<typeof setTimeout> | undefined
  let lastExecutedAt = 0
  let hasExecuted = false
  let lastArgs: Parameters<F> | undefined
  let lastThis: unknown
  let result: ReturnType<F> | undefined

  const invoke = (): ReturnType<F> | undefined => {
    if (!lastArgs) return result

    lastExecutedAt = Date.now()
    hasExecuted = true
    result = callback.apply(lastThis, lastArgs)
    lastArgs = undefined
    lastThis = undefined
    return result
  }

  const throttled = function (this: unknown, ...args: Parameters<F>): void {
    const now = Date.now()
    const remaining = delay - (now - lastExecutedAt)

    lastArgs = args
    lastThis = this

    if (!hasExecuted || remaining <= 0 || remaining > delay) {
      if (timeoutId !== undefined) clearTimeout(timeoutId)
      timeoutId = undefined
      invoke()
      return
    }

    if (!timeoutId) {
      timeoutId = setTimeout(() => {
        timeoutId = undefined
        invoke()
      }, remaining)
    }
  } as Throttled<F>

  throttled.cancel = () => {
    if (timeoutId !== undefined) clearTimeout(timeoutId)
    timeoutId = undefined
    lastArgs = undefined
    lastThis = undefined
  }

  throttled.flush = () => {
    if (timeoutId !== undefined) clearTimeout(timeoutId)
    timeoutId = undefined
    return invoke()
  }

  throttled.pending = () => timeoutId !== undefined

  return throttled
}

export default throttle
