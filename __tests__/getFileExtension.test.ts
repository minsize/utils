import { getFileExtension } from "../src"
test("getFileExtension", () => expect(getFileExtension("/files/photo.PNG?raw=1")).toBe("png"))
