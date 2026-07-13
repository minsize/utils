import { copyImageToClipboard } from "../src"
test("copyImageToClipboard is SSR safe", async () => await expect(copyImageToClipboard(new Blob(["x"], { type: "image/png" }))).resolves.toBe(false))
