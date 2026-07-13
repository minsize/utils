import { formatBytes } from "../src"

describe("formatBytes", () => {
  it("formats byte sizes and rejects invalid input", () => {
    expect(formatBytes(0)).toBe("0 B")
    expect(formatBytes(1536)).toBe("1.5 KB")
    expect(formatBytes(1024 ** 2, 0)).toBe("1 MB")
    expect(() => formatBytes(-1)).toThrow(RangeError)
  })
})
