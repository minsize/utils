import { parseVersionString } from "../src"

describe("parseVersionString", () => {
  it("parses version parts and prerelease labels", () => {
    expect(parseVersionString("1.2.3-beta")).toEqual({
      major: 1,
      minor: 2,
      patch: 3,
      prerelease: "beta",
    })
    expect(parseVersionString("*.2.3").major).toBe("*")
  })
})
