import { readFileAsText } from "../src"
test("readFileAsText", async () => await expect(readFileAsText(new Blob(["text"]))).resolves.toBe("text"))
