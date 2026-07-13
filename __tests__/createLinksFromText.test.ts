import { createLinksFromText } from "../src"

describe("createLinksFromText", () => {
  it("replaces templates with callback results", () => {
    expect(
      createLinksFromText("Read {{docs:documentation}}", (key, text) => ({
        key,
        text,
      })),
    ).toEqual(["Read ", { key: "docs", text: "documentation" }, ""])
  })
})
