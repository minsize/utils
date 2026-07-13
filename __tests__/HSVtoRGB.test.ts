import { HSVtoRGB } from "../src"

describe("HSVtoRGB", () => {
  it("converts a primary HSV color", () => {
    expect(HSVtoRGB(0, 1, 1)).toEqual([255, 0, 0])
  })
})
