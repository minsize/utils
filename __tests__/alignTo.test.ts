import { alignTo } from "../src"

describe("alignTo", () => {
  it("rounds positive numbers up to the next multiple", () => {
    expect(alignTo(5, 4)).toBe(8)
    expect(alignTo(8, 4)).toBe(8)
  })
})
