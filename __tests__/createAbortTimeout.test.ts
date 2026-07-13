import { createAbortTimeout } from "../src"
test("createAbortTimeout", () => { jest.useFakeTimers(); const signal = createAbortTimeout(10); jest.advanceTimersByTime(10); expect(signal.aborted).toBe(true); jest.useRealTimers() })
