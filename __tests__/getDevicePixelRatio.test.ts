import { getDevicePixelRatio } from "../src"
test("getDevicePixelRatio is SSR safe", () => expect(getDevicePixelRatio()).toBe(1))
