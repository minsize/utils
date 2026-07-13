import { textParserUrl } from "../src"

describe("textParserUrl", () => {
  it("uses a custom URL expression", () => {
    expect(textParserUrl("Open ticket-123", { regex: /(ticket-\d+)/ })).toEqual([
      { type: "raw", value: "Open " },
      { type: "url", value: "ticket-123" },
      { type: "raw", value: " " },
    ])
  })
})
