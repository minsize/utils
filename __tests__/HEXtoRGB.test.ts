import { HEXtoRGB } from "../src"

describe("HEXtoRGB", () => {
  it("converts long and short HEX notation", () => {
    expect(HEXtoRGB("#ff8000")).toEqual([255, 128, 0])
    expect(HEXtoRGB("0f8")).toEqual([0, 255, 136])
  })
})
