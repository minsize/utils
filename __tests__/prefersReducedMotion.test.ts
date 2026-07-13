import { prefersReducedMotion } from "../src"
test("prefersReducedMotion is SSR safe", () => expect(prefersReducedMotion()).toBe(false))
