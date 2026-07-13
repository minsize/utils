import { focusFirst } from "../src"
test("focusFirst is SSR safe", () => expect(focusFirst({} as ParentNode)).toBeUndefined())
