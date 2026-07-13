import { getChangedData } from "../src"

describe("getChangedData", () => {
  it("returns only added, changed, and removed object fields", () => {
    expect(
      getChangedData(
        { name: "Ann", age: 20, active: true },
        { name: "Ann", age: 21, city: "Moscow" },
      ),
    ).toEqual({ age: 21, city: "Moscow", active: undefined })
  })
})
