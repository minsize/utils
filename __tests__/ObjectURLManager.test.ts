import { ObjectURLManager } from "../src"

describe("ObjectURLManager", () => {
  it("revokes the previous URL when its key is replaced", () => {
    const create = jest
      .spyOn(URL, "createObjectURL")
      .mockReturnValueOnce("blob:first")
      .mockReturnValueOnce("blob:second")
    const revoke = jest.spyOn(URL, "revokeObjectURL").mockImplementation()
    const urls = new ObjectURLManager()

    try {
      expect(urls.create("preview", new Blob(["one"]), 1_000)).toBe("blob:first")
      expect(urls.create("preview", new Blob(["two"]), 1_000)).toBe("blob:second")
      expect(revoke).toHaveBeenCalledWith("blob:first")
    } finally {
      create.mockRestore()
      revoke.mockRestore()
    }
  })
})
