import waitForAnimationFrame from "./waitForAnimationFrame"

/** Alias for waitForAnimationFrame. @example await nextFrame() */
const nextFrame = (): Promise<number> => waitForAnimationFrame()

export default nextFrame
