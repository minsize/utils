import { parseCookies } from "../src"
test("parseCookies", () => expect(parseCookies("theme=dark; name=Ann%20Lee")).toEqual({ theme: "dark", name: "Ann Lee" }))
