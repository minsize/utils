import { copyText } from "../src"

describe("copyText", () => {
  it("uses the document fallback when Clipboard API is unavailable", () => {
    const originalDocument = (global as { document?: Document }).document
    const select = jest.fn()
    const input = { value: "", select }
    const documentMock = {
      createElement: jest.fn(() => input),
      body: { appendChild: jest.fn(), removeChild: jest.fn() },
      execCommand: jest.fn(),
    } as unknown as Document

    Object.defineProperty(global, "document", {
      configurable: true,
      value: documentMock,
    })

    try {
      copyText("copied")
      expect(input.value).toBe("copied")
      expect(select).toHaveBeenCalledTimes(1)
      expect(documentMock.execCommand).toHaveBeenCalledWith("copy")
    } finally {
      Object.defineProperty(global, "document", {
        configurable: true,
        value: originalDocument,
      })
    }
  })
})
