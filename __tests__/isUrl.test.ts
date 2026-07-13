import { isUrl } from "../src"
test("isUrl", () => { expect(isUrl("https://example.com")).toBe(true); expect(isUrl("/relative")).toBe(false) })
