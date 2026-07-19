import {
  capitalize,
  getFileExtension,
  getFileNameWithoutExtension,
  parseQueryString,
  parseVersionString,
  toCamelCase,
  truncate,
} from "../src"

describe("text and URL edge cases", () => {
  it("handles empty values and file-name edge cases", () => {
    expect(capitalize("")).toBe("")
    expect(getFileExtension(".env")).toBe("")
    expect(getFileExtension("name.")).toBe("")
    expect(getFileExtension("/path/PHOTO.PNG?raw=1")).toBe("png")
    expect(getFileNameWithoutExtension(".env")).toBe(".env")
    expect(getFileNameWithoutExtension("archive.tar.gz#fragment")).toBe("archive.tar")
    expect(toCamelCase("")).toBe("")
  })

  it("supports wildcard versions and rejects malformed input", () => {
    expect(parseVersionString("*.2.*")).toEqual({ major: "*", minor: 2, patch: "*", prerelease: null })
    expect(() => parseVersionString("1.2")).toThrow("Invalid version string")
    expect(parseQueryString("a=1&b=2")).toEqual({ a: "1", b: "2" })
  })

  it("covers every truncation outcome", () => {
    expect(truncate("short", 5)).toBe("short")
    expect(truncate("long", 2)).toBe("..")
    expect(truncate("abcdef", 5, "~")).toBe("abcd~")
    expect(() => truncate("x", -1)).toThrow(RangeError)
  })
})
