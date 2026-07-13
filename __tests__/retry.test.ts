import { retry } from "../src"

describe("retry", () => {
  it("retries a rejected operation until it succeeds", async () => {
    const operation = jest
      .fn<Promise<string>, []>()
      .mockRejectedValueOnce(new Error("temporary"))
      .mockResolvedValue("done")

    await expect(retry(operation, 1, 0)).resolves.toBe("done")
    expect(operation).toHaveBeenCalledTimes(2)
  })
})
