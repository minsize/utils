import { debounce } from "../src"

describe("debounce", () => {
  afterEach(() => jest.useRealTimers())

  it("delays the last call and supports flush and cancel", () => {
    jest.useFakeTimers()
    const callback = jest.fn((value: string) => value)
    const delayed = debounce(callback, 100)

    delayed("first")
    delayed("last")
    expect(delayed.pending()).toBe(true)

    expect(delayed.flush()).toBe("last")
    expect(callback).toHaveBeenCalledTimes(1)

    delayed("cancelled")
    delayed.cancel()
    jest.advanceTimersByTime(100)
    expect(callback).toHaveBeenCalledTimes(1)
  })
})
