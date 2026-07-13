import { waitForTransition } from "../src"
test("waitForTransition resolves after timeout", async () => { jest.useFakeTimers(); const element = { addEventListener: jest.fn(), removeEventListener: jest.fn() } as unknown as HTMLElement; const waiting = waitForTransition(element, 1); jest.advanceTimersByTime(1); await expect(waiting).resolves.toBeUndefined(); jest.useRealTimers() })
