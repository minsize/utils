import { generateUniqueKey } from "../src"

describe("generateUniqueKey", () => {
  it("returns the same key for objects with the same unordered fields", () => {
    expect(generateUniqueKey({ a: 1, b: 2 })).toBe(
      generateUniqueKey({ b: 2, a: 1 }),
    )
  })
})
