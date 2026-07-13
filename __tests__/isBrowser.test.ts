import { isBrowser } from "../src"

describe("isBrowser", () => {
  it("detects the presence of browser globals", () => {
    const windowDescriptor = Object.getOwnPropertyDescriptor(global, "window")
    const documentDescriptor = Object.getOwnPropertyDescriptor(global, "document")

    Object.defineProperty(global, "window", { configurable: true, value: {} })
    Object.defineProperty(global, "document", { configurable: true, value: {} })

    try {
      expect(isBrowser()).toBe(true)
    } finally {
      if (windowDescriptor) Object.defineProperty(global, "window", windowDescriptor)
      else Reflect.deleteProperty(global, "window")

      if (documentDescriptor)
        Object.defineProperty(global, "document", documentDescriptor)
      else Reflect.deleteProperty(global, "document")
    }
  })
})
