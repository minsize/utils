import { setCookie } from "../src"
test("setCookie is SSR safe", () => expect(setCookie("theme", "dark")).toBe(false))
