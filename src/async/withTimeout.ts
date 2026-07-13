/** Rejects a promise if it does not settle in time. @example await withTimeout(fetch("/api"), 5_000) */
function withTimeout<T>(promise: PromiseLike<T>, timeout: number): Promise<T> {
  if (!Number.isFinite(timeout) || timeout < 0) throw new RangeError("Timeout must be a finite non-negative number.")
  return new Promise<T>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      const error = new Error(`Operation timed out after ${timeout} ms.`)
      error.name = "TimeoutError"
      reject(error)
    }, timeout)
    Promise.resolve(promise).then(
      (value) => { clearTimeout(timeoutId); resolve(value) },
      (error) => { clearTimeout(timeoutId); reject(error) },
    )
  })
}

export default withTimeout
