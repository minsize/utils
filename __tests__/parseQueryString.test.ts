import { parseQueryString } from "../src"

describe("parseQueryString", () => {
  it("decodes query values without truncating equals signs", () => {
    expect(parseQueryString("?token=a%3Db%3Dc&name=Ann+Lee")).toEqual({
      token: "a=b=c",
      name: "Ann Lee",
    })
  })
})
