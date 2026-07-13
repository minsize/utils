import { getScrollbarWidth } from "../src"
test("getScrollbarWidth is SSR safe", () => expect(getScrollbarWidth()).toBe(0))
