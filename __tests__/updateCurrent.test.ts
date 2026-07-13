import { updateCurrent } from "../src"

describe("updateCurrent", () => {
  it("keeps current values and fills missing values from next", () => {
    expect(updateCurrent({ page: 1 }, { page: 2, size: 20 })).toEqual({
      page: 1,
      size: 20,
    })
  })
})
