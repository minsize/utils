import { setStorageItem } from "../src"
test("setStorageItem is SSR safe", () => expect(setStorageItem("theme", "dark")).toBe(false))
