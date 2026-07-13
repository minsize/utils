import { safeJsonParse } from "../src"

describe("safeJsonParse", () => {
  it("returns parsed data or the supplied fallback", () => {
    expect(safeJsonParse<{ page: number }>("{\"page\":2}")).toEqual({ page: 2 })
    expect(safeJsonParse("invalid", null)).toBeNull()
    expect(safeJsonParse("invalid")).toBeUndefined()
  })
})
