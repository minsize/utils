import { orderBy } from "../src"

describe("orderBy", () => {
  it("sorts a copy by nested properties and direction", () => {
    const items = [{ meta: { rank: 2 } }, { meta: { rank: 1 } }]

    expect(orderBy(items, { "meta.rank": "asc" })).toEqual([
      { meta: { rank: 1 } },
      { meta: { rank: 2 } },
    ])
    expect(items[0].meta.rank).toBe(2)
  })
})
