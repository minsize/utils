import { prefersColorScheme } from "../src"
test("prefersColorScheme is SSR safe", () => expect(prefersColorScheme()).toBe("no-preference"))
