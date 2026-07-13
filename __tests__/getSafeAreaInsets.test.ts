import { getSafeAreaInsets } from "../src"
test("getSafeAreaInsets is SSR safe", () => expect(getSafeAreaInsets()).toEqual({ top: 0, right: 0, bottom: 0, left: 0 }))
