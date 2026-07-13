import { scrollIntoViewIfNeeded } from "../src"
test("scrollIntoViewIfNeeded is SSR safe", () => expect(scrollIntoViewIfNeeded({} as Element)).toBe(false))
