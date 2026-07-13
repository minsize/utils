import { getStorageItem } from "../src"
test("getStorageItem is SSR safe", () => expect(getStorageItem("theme", "light")).toBe("light"))
