import { getScrollParent } from "../src"
test("getScrollParent is SSR safe", () => expect(getScrollParent({} as HTMLElement)).toBeNull())
