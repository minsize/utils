import { RGBtoHSV } from "../src"

describe("RGBtoHSV", () => {
  it("converts a primary RGB color", () => {
    expect(RGBtoHSV(255, 0, 0)).toEqual([0, 1, 1])
  })
})
