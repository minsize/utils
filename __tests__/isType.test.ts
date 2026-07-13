import { isType } from "../src"

describe("isType", () => {
  it("returns and checks normalized value types", () => {
    expect(isType([])).toBe("array")
    expect(isType(new Date())).toBe("date")
    expect(isType(NaN, "nan")).toBe(true)
    expect(isType("value", "number")).toBe(false)
  })
})
