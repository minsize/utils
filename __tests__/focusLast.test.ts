import { focusLast } from "../src"
test("focusLast is SSR safe", () => expect(focusLast({} as ParentNode)).toBeUndefined())
