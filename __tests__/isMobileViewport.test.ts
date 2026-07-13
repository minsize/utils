import { isMobileViewport } from "../src"
test("isMobileViewport is SSR safe", () => expect(isMobileViewport()).toBe(false))
