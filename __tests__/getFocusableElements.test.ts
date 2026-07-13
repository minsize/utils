import { getFocusableElements } from "../src"

describe("getFocusableElements", () => {
  it("returns visible, enabled elements with a non-negative tab index", () => {
    const documentDescriptor = Object.getOwnPropertyDescriptor(global, "document")
    const visible = {
      hidden: false,
      tabIndex: 0,
      getAttribute: () => null,
    } as unknown as HTMLElement
    const disabled = {
      hidden: false,
      tabIndex: -1,
      getAttribute: () => null,
    } as unknown as HTMLElement
    const hidden = {
      hidden: true,
      tabIndex: 0,
      getAttribute: () => null,
    } as unknown as HTMLElement
    const container = {
      querySelectorAll: jest.fn(() => [visible, disabled, hidden]),
    } as unknown as ParentNode

    Object.defineProperty(global, "document", { configurable: true, value: {} })

    try {
      expect(getFocusableElements(container)).toEqual([visible])
    } finally {
      if (documentDescriptor)
        Object.defineProperty(global, "document", documentDescriptor)
      else Reflect.deleteProperty(global, "document")
    }
  })
})
