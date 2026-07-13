import { unique } from "../src"

describe("unique", () => {
  it("returns values only once while preserving insertion order", () => {
    expect(unique(["a", "b", "a", "c", "b"])).toEqual(["a", "b", "c"])
  })
})
