import { groupBy } from "../src"

describe("groupBy", () => {
  it("groups items by the key returned from the callback", () => {
    expect(groupBy(["ant", "bear", "cat"], (word) => word.length)).toEqual({
      3: ["ant", "cat"],
      4: ["bear"],
    })
  })
})
