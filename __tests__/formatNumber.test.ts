import { formatNumber } from "../src"

describe("formatNumber", () => {
  it("separates thousands with dots", () => {
    expect(formatNumber(1234567)).toBe("1.234.567")
    expect(formatNumber(0)).toBe("0")
  })
})
