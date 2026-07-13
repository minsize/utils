import { random } from "../src"

describe("random", () => {
  it("returns an in-range deterministic integer when a seed is supplied", () => {
    expect(random(1, 100, 0)).toBe(83)
    expect(random(1, 100, 42)).toBe(random(1, 100, 42))
  })
})
