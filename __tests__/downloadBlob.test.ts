import { downloadBlob } from "../src"
test("downloadBlob is SSR safe", () => expect(downloadBlob(new Blob(["x"]), "x.txt")).toBe(false))
