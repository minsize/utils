import { withTimeout } from "../src"
test("withTimeout", async () => { await expect(withTimeout(Promise.resolve("ok"), 10)).resolves.toBe("ok"); await expect(withTimeout(new Promise(() => undefined), 0)).rejects.toMatchObject({ name: "TimeoutError" }) })
