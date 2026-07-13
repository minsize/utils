import { omit } from "../src"

describe("omit", () => {
  it("returns an object without the specified keys", () => {
    expect(omit({ id: 1, name: "Ann" }, ["id"])).toEqual({ name: "Ann" })
  })
})
