import { comparison } from "../src"

describe("comparison", () => {
  it("deeply compares objects, arrays, dates, maps, and sets", () => {
    expect(comparison({ nested: [1, { ok: true }] }, { nested: [1, { ok: true }] })).toBe(true)
    expect(comparison(new Date(1), new Date(1))).toBe(true)
    expect(comparison(new Map([["key", 1]]), new Map([["key", 1]]))).toBe(true)
    expect(comparison(new Set([1, 2]), new Set([1, 2]))).toBe(true)
    expect(comparison({ value: 1 }, { value: 2 })).toBe(false)
  })
})
