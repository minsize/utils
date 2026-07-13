import { memoize } from "../src"

describe("memoize", () => {
  it("caches a result for equal argument lists", () => {
    const callback = jest.fn((left: number, right: number) => left + right)
    const sum = memoize(callback)

    expect(sum(2, 3)).toBe(5)
    expect(sum(2, 3)).toBe(5)
    expect(callback).toHaveBeenCalledTimes(1)
  })
})
