import { getImageDimensions } from "../src"
test("getImageDimensions rejects without browser Image", async () => await expect(getImageDimensions("image.png")).rejects.toThrow("Image"))
