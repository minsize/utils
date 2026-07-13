import { waitForAnimationFrame } from "../src"
test("waitForAnimationFrame falls back to a timer", async () => { jest.useFakeTimers(); const frame = waitForAnimationFrame(); jest.runAllTimers(); await expect(frame).resolves.toEqual(expect.any(Number)); jest.useRealTimers() })
