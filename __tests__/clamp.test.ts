import { clamp } from "../src"

describe("clamp", () => {
  it("keeps a value within inclusive bounds", () => {
    expect(clamp(-1, 0, 10)).toBe(0)
    expect(clamp(5, 0, 10)).toBe(5)
    expect(clamp(11, 0, 10)).toBe(10)
  })
})
