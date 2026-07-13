import { setCssVariable } from "../src"
test("setCssVariable is SSR safe", () => expect(setCssVariable("--color", "red")).toBe(false))
