/** Resolves when an element transition ends or a timeout is reached. @example await waitForTransition(panel) */
function waitForTransition(element: HTMLElement, timeout: number = 1_000): Promise<void> {
  if (!Number.isFinite(timeout) || timeout < 0) throw new RangeError("Timeout must be a finite non-negative number.")
  return new Promise((resolve) => {
    const done = () => { clearTimeout(timeoutId); element.removeEventListener("transitionend", onEnd); resolve() }
    const onEnd = (event: TransitionEvent) => { if (event.target === element) done() }
    const timeoutId = setTimeout(done, timeout)
    element.addEventListener("transitionend", onEnd)
  })
}

export default waitForTransition
