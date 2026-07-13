import { removeCookie } from "../src"
test("removeCookie is SSR safe", () => expect(removeCookie("theme")).toBe(false))
