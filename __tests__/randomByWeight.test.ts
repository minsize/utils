import { randomByWeight } from "../src"

describe("randomByWeight", () => {
  it("selects items according to valid weights and rejects invalid input", () => {
    expect(randomByWeight({ hidden: 0, shown: 1 }, 42)).toBe("shown")
    expect(() => randomByWeight({})).toThrow(RangeError)
    expect(() => randomByWeight({ invalid: -1 })).toThrow(RangeError)
  })
})
