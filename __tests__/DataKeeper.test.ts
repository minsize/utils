import { DataKeeper } from "../src"

describe("DataKeeper", () => {
  it("tracks changes and resets the initial value", () => {
    const keeper = new DataKeeper({ name: "Ann", age: 20 })
    keeper.setter((value) => ({ ...value, age: 21 }))

    expect(keeper.isModified()).toBe(true)
    expect(keeper.updateValues).toEqual({ age: 21 })

    keeper.reset({ name: "Ann", age: 20 })
    expect(keeper.isModified()).toBe(false)
  })
})
