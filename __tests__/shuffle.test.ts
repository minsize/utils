import { shuffle } from "../src"

describe("shuffle", () => {
  it("keeps all values and returns the same array instance", () => {
    const input = [1, 2, 3, 4]
    const result = shuffle(input, 42)

    expect(result).toBe(input)
    expect([...result].sort()).toEqual([1, 2, 3, 4])
  })
})
