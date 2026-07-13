import { sleep } from "../src"

describe("sleep", () => {
  it("resolves after the requested delay", async () => {
    jest.useFakeTimers()
    const result = sleep(100)
    jest.advanceTimersByTime(100)

    await expect(result).resolves.toBeUndefined()
    jest.useRealTimers()
  })
})
