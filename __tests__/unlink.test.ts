import { unlink } from "../src"

describe("unlink", () => {
  it("creates an independent copy of nested arrays and objects", () => {
    const source = { values: [{ active: true }] }
    const copy = unlink(source)

    copy.values[0].active = false
    expect(source.values[0].active).toBe(true)
  })
})
