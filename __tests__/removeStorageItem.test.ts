import { removeStorageItem } from "../src"
test("removeStorageItem is SSR safe", () => expect(removeStorageItem("theme")).toBe(false))
