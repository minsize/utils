import { isTouchDevice } from "../src"
test("isTouchDevice is SSR safe", () => expect(isTouchDevice()).toBe(false))
