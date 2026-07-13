import { elasticClamp } from "../src"

describe("elasticClamp", () => {
  it("keeps in-range values and softly resists values outside bounds", () => {
    expect(elasticClamp(5, 0, 10)).toBe(5)
    expect(elasticClamp(-10, 0, 10)).toBeLessThan(0)
    expect(elasticClamp(-10, 0, 10)).toBeGreaterThan(-10)
    expect(elasticClamp(20, 0, 10)).toBeGreaterThan(10)
    expect(elasticClamp(20, 0, 10)).toBeLessThan(20)
  })
})
