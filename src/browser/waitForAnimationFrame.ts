/** Resolves on the next animation frame, with an SSR-safe timer fallback. @example await waitForAnimationFrame() */
const waitForAnimationFrame = (): Promise<number> => new Promise((resolve) =>
  typeof requestAnimationFrame === "undefined" ? setTimeout(() => resolve(Date.now()), 0) : requestAnimationFrame(resolve),
)

export default waitForAnimationFrame
