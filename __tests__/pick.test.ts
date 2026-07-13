import { pick } from "../src"

describe("pick", () => {
  it("returns an object with only the specified keys", () => {
    expect(pick({ id: 1, name: "Ann" }, ["id"])).toEqual({ id: 1 })
  })
})
