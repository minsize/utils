import { readFileAsDataUrl } from "../src"
test("readFileAsDataUrl rejects without browser FileReader", async () => await expect(readFileAsDataUrl(new Blob(["text"]))).rejects.toThrow("FileReader"))
