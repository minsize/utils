import { once } from "../src"

describe("once", () => {
  it("calls the wrapped function once and reuses its result", () => {
    const callback = jest.fn((value: number) => value * 2)
    const runOnce = once(callback)

    expect(runOnce(2)).toBe(4)
    expect(runOnce(3)).toBe(4)
    expect(callback).toHaveBeenCalledTimes(1)
  })
})
