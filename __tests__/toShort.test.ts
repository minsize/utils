import { toShort } from "../src"

describe("toShort", () => {
  it("formats large numbers with compact suffixes", () => {
    expect(toShort(1_250)).toBe("1.2k")
    expect(toShort(-2_000)).toBe("-2k")
  })
})
