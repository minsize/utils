import { getCssVariable } from "../src"
test("getCssVariable is SSR safe", () => expect(getCssVariable("--color")).toBeUndefined())
