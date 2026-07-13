import { isElementVisible } from "../src"
test("isElementVisible is SSR safe", () => expect(isElementVisible({} as Element)).toBe(false))
