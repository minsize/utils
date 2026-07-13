import { RGBtoHEX } from "../src"

describe("RGBtoHEX", () => {
  it("converts RGB components to a padded HEX string", () => {
    expect(RGBtoHEX(0, 15, 255)).toBe("#000fff")
  })
})
