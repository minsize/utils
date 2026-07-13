import { chunks } from "../src"

describe("chunks", () => {
  it("splits an array and validates the chunk size", () => {
    expect(chunks(2, [1, 2, 3, 4, 5])).toEqual([[1, 2], [3, 4], [5]])
    expect(() => chunks(0, [1])).toThrow(RangeError)
  })
})
