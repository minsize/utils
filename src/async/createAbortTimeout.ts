/** Creates an AbortSignal that aborts after a timeout. @example fetch("/api", { signal: createAbortTimeout(5_000) }) */
function createAbortTimeout(timeout: number): AbortSignal {
  if (!Number.isFinite(timeout) || timeout < 0) throw new RangeError("Timeout must be a finite non-negative number.")
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), timeout)
  controller.signal.addEventListener("abort", () => clearTimeout(timeoutId), { once: true })
  return controller.signal
}

export default createAbortTimeout
