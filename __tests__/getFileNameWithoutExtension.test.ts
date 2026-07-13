import { getFileNameWithoutExtension } from "../src"
test("getFileNameWithoutExtension", () => expect(getFileNameWithoutExtension("/files/photo.png")).toBe("photo"))
