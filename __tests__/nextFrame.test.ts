import { nextFrame } from "../src"
test("nextFrame resolves", async () => { jest.useFakeTimers(); const frame = nextFrame(); jest.runAllTimers(); await expect(frame).resolves.toEqual(expect.any(Number)); jest.useRealTimers() })
