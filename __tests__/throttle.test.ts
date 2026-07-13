import { throttle } from "../src"

describe("throttle", () => {
  afterEach(() => jest.useRealTimers())

  it("runs immediately and schedules the latest call for the interval end", () => {
    jest.useFakeTimers().setSystemTime(0)
    const callback = jest.fn()
    const limited = throttle(callback, 100)

    limited("first")
    limited("last")

    expect(callback).toHaveBeenCalledWith("first")
    expect(limited.pending()).toBe(true)

    jest.advanceTimersByTime(100)
    expect(callback).toHaveBeenLastCalledWith("last")
    expect(callback).toHaveBeenCalledTimes(2)
  })
})
