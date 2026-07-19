import {
  ObjectURLManager,
  copyImageToClipboard,
  copyText,
  createMediaQuery,
  downloadBlob,
  getCssVariable,
  getDevicePixelRatio,
  getElementOffset,
  getImageDimensions,
  getSafeAreaInsets,
  getScrollParent,
  getScrollbarWidth,
  getStorageItem,
  isElementVisible,
  isMobileViewport,
  isTouchDevice,
  parseCookies,
  prefersColorScheme,
  prefersReducedMotion,
  readFileAsDataUrl,
  removeCookie,
  removeStorageItem,
  scrollIntoViewIfNeeded,
  setCookie,
  setCssVariable,
  setStorageItem,
  waitForAnimationFrame,
  waitForTransition,
} from "../src"

const runtime = globalThis as Record<string, unknown>
const browserGlobals = [
  "window",
  "document",
  "localStorage",
  "navigator",
  "ClipboardItem",
  "Image",
  "FileReader",
  "requestAnimationFrame",
]
const savedGlobals = new Map(browserGlobals.map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]))

function setGlobal(name: string, value: unknown) {
  Object.defineProperty(globalThis, name, { configurable: true, writable: true, value })
}

afterEach(() => {
  for (const name of browserGlobals) {
    const descriptor = savedGlobals.get(name)
    if (descriptor) Object.defineProperty(globalThis, name, descriptor)
    else delete runtime[name]
  }
  jest.useRealTimers()
})

describe("browser helpers with DOM APIs", () => {
  it("uses Clipboard API and handles a rejected clipboard write", async () => {
    const write = jest.fn().mockResolvedValue(undefined)
    class Item { constructor(readonly value: unknown) {} }
    setGlobal("navigator", { clipboard: { write } })
    setGlobal("ClipboardItem", Item)

    expect(await copyImageToClipboard(new Blob(["x"], { type: "image/png" }))).toBe(true)
    expect(write).toHaveBeenCalledTimes(1)
    write.mockRejectedValueOnce(new Error("denied"))
    expect(await copyImageToClipboard(new Blob(["x"], { type: "image/png" }))).toBe(false)
    expect(await copyImageToClipboard(new Blob(["x"]))).toBe(false)
  })

  it("copies text with the clipboard and input fallback", () => {
    const input = { value: "", select: jest.fn() }
    const document = {
      createElement: jest.fn(() => input),
      body: { appendChild: jest.fn(), removeChild: jest.fn() },
      execCommand: jest.fn(),
    }
    setGlobal("document", document)
    setGlobal("navigator", { clipboard: { writeText: jest.fn(() => { throw new Error("denied") }) } })

    copyText("hello")
    copyText("")
    expect(input.value).toBe("hello")
    expect(document.execCommand).toHaveBeenCalledWith("copy")
    expect(document.createElement).toHaveBeenCalledTimes(1)
  })

  it("subscribes through modern and legacy media-query APIs", () => {
    const listener = jest.fn()
    const modern = { addEventListener: jest.fn(), removeEventListener: jest.fn() }
    setGlobal("window", { matchMedia: jest.fn(() => modern) })
    const stop = createMediaQuery("(min-width: 1px)", listener)
    const handler = modern.addEventListener.mock.calls[0][1]
    handler({ matches: true })
    stop()
    expect(listener).toHaveBeenCalledWith(true)
    expect(modern.removeEventListener).toHaveBeenCalledWith("change", handler)

    const legacy = { addListener: jest.fn(), removeListener: jest.fn() }
    setGlobal("window", { matchMedia: jest.fn(() => legacy) })
    createMediaQuery("x", listener)()
    expect(legacy.addListener).toHaveBeenCalled()
    expect(legacy.removeListener).toHaveBeenCalled()
  })

  it("manages object URLs, expiration and timers", () => {
    jest.useFakeTimers().setSystemTime(1_000)
    const create = jest.spyOn(URL, "createObjectURL").mockReturnValue("blob:one")
    const revoke = jest.spyOn(URL, "revokeObjectURL").mockImplementation()
    const urls = new ObjectURLManager()
    urls.createWithAutoRevoke("preview", new Blob(["x"]), 10)
    expect(urls.access("missing")).toBe(false)
    expect(urls.access("preview")).toBe(true)
    expect(urls.isExpired("missing")).toBe(true)
    jest.advanceTimersByTime(11)
    expect(urls.isExpired("preview")).toBe(true)
    expect(urls.cleanup()).toBe(1)
    expect(revoke).toHaveBeenCalledWith("blob:one")
    expect(urls.revoke("preview")).toBe(false)

    urls.create("old", new Blob(["x"]), 5)
    jest.advanceTimersByTime(6)
    expect(urls.cleanup()).toBe(1)
    create.mockRestore()
    revoke.mockRestore()
  })

  it("revokes URLs from both automatic timers when they observe expiry", () => {
    jest.useFakeTimers().setSystemTime(1_000)
    const create = jest.spyOn(URL, "createObjectURL").mockReturnValue("blob:auto")
    const revoke = jest.spyOn(URL, "revokeObjectURL").mockImplementation()
    const now = jest.spyOn(Date, "now").mockReturnValue(2_000)
    const urls = new ObjectURLManager()
    urls.createWithAutoRevoke("auto", new Blob(["x"]), 10)
    jest.advanceTimersByTime(10)
    expect(revoke).toHaveBeenCalledWith("blob:auto")
    urls.createWithAutoRevoke("access", new Blob(["x"]), 10)
    urls.access("access")
    jest.advanceTimersByTime(10)
    expect(revoke).toHaveBeenCalledTimes(2)
    now.mockRestore()
    create.mockRestore()
    revoke.mockRestore()
  })

  it("downloads blobs and reads image dimensions", async () => {
    const link = { style: {}, click: jest.fn(), remove: jest.fn() }
    const document = { createElement: jest.fn(() => link), body: { appendChild: jest.fn() } }
    setGlobal("document", document)
    const create = jest.spyOn(URL, "createObjectURL").mockReturnValue("blob:image")
    const revoke = jest.spyOn(URL, "revokeObjectURL").mockImplementation()
    expect(downloadBlob(new Blob(["x"]), "x.txt")).toBe(true)
    expect(link).toMatchObject({ href: "blob:image", download: "x.txt" })

    class LoadedImage {
      naturalWidth = 20
      naturalHeight = 10
      onload: (() => void) | null = null
      onerror: (() => void) | null = null
      set src(_: string) { this.onload?.() }
    }
    setGlobal("Image", LoadedImage)
    await expect(getImageDimensions(new Blob(["x"]))).resolves.toEqual({ width: 20, height: 10 })

    class BrokenImage extends LoadedImage { set src(_: string) { this.onerror?.() } }
    setGlobal("Image", BrokenImage)
    await expect(getImageDimensions("bad.png")).rejects.toThrow("Could not load image")
    expect(revoke).toHaveBeenCalled()
    create.mockRestore()
    revoke.mockRestore()
  })

  it("uses browser geometry, CSS and scroll APIs", () => {
    const root = { style: { setProperty: jest.fn() }, clientWidth: 980 }
    const temporary = { style: {}, remove: jest.fn() }
    const document = { documentElement: root, body: { appendChild: jest.fn() }, createElement: jest.fn(() => temporary), scrollingElement: root }
    const window = {
      innerWidth: 1_000, innerHeight: 600, scrollX: 4, scrollY: 8,
      devicePixelRatio: 2,
      getComputedStyle: jest.fn((element: unknown) => element === temporary
        ? { top: "1px", right: "2px", bottom: "3px", left: "4px", overflow: "visible", overflowX: "visible", overflowY: "visible", getPropertyValue: () => " teal " }
        : { overflow: "auto", overflowX: "visible", overflowY: "visible", getPropertyValue: () => " teal " }),
    }
    setGlobal("document", document)
    setGlobal("window", window)
    expect(getCssVariable("--brand")).toBe("teal")
    expect(getDevicePixelRatio()).toBe(2)
    expect(getElementOffset({ getBoundingClientRect: () => ({ top: 2, left: 3 }) } as Element)).toEqual({ top: 10, left: 7 })
    expect(getSafeAreaInsets()).toEqual({ top: 1, right: 2, bottom: 3, left: 4 })
    expect(getScrollbarWidth()).toBe(20)
    expect(setCssVariable("--brand", "red")).toBe(true)
    expect(root.style.setProperty).toHaveBeenCalledWith("--brand", "red")

    const parent = { parentElement: null }
    const child = { parentElement: parent }
    expect(getScrollParent(child as unknown as HTMLElement)).toBe(parent)
    const visible = { getBoundingClientRect: () => ({ top: 10, left: 10, bottom: 20, right: 20 }) }
    const hidden = { getBoundingClientRect: () => ({ top: -10, left: 0, bottom: -1, right: 5 }) }
    expect(isElementVisible(visible as Element)).toBe(true)
    expect(isElementVisible(hidden as Element)).toBe(false)
    expect(isMobileViewport(1_200)).toBe(true)
    setGlobal("navigator", { maxTouchPoints: 1 })
    expect(isTouchDevice()).toBe(true)
  })

  it("handles cookies, storage, visibility and preferences", () => {
    const values = new Map<string, string>()
    const storage = { values, getItem: jest.fn((key: string) => values.get(key) ?? null), setItem: jest.fn((key: string, value: string) => values.set(key, value)), removeItem: jest.fn((key: string) => values.delete(key)) }
    const document = { cookie: "theme=dark; encoded=a%20b", documentElement: { style: { setProperty: jest.fn() } } }
    const window = { innerWidth: 100, innerHeight: 100, matchMedia: (query: string) => ({ matches: query.includes("dark") || query.includes("reduce") }) }
    setGlobal("document", document)
    setGlobal("window", window)
    setGlobal("localStorage", storage)
    expect(parseCookies()).toEqual({ theme: "dark", encoded: "a b" })
    expect(setCookie("a b", "c d", { path: "/", maxAge: 1.9, sameSite: "lax", secure: true })).toBe(true)
    expect(document.cookie).toContain("a%20b=c%20d")
    expect(removeCookie("a")).toBe(true)
    expect(setStorageItem("settings", { dark: true })).toBe(true)
    expect(getStorageItem("settings")).toEqual({ dark: true })
    expect(removeStorageItem("settings")).toBe(true)
    expect(prefersColorScheme()).toBe("dark")
    expect(prefersReducedMotion()).toBe(true)

    const element = { getBoundingClientRect: () => ({ top: 200, left: 0, bottom: 250, right: 10 }), scrollIntoView: jest.fn() }
    expect(scrollIntoViewIfNeeded(element as unknown as Element)).toBe(true)
    expect(element.scrollIntoView).toHaveBeenCalled()
  })

  it("supports FileReader, animation frames and transition completion", async () => {
    class Reader {
      result: string | null = "data:text/plain;base64,eA=="
      error: Error | null = null
      onload: (() => void) | null = null
      onerror: (() => void) | null = null
      readAsDataURL() { this.onload?.() }
    }
    setGlobal("FileReader", Reader)
    await expect(readFileAsDataUrl(new Blob(["x"]))).resolves.toBe("data:text/plain;base64,eA==")
    setGlobal("requestAnimationFrame", (callback: (time: number) => void) => callback(42))
    await expect(waitForAnimationFrame()).resolves.toBe(42)

    const listeners = new Map<string, (event: { target: unknown }) => void>()
    const element = { addEventListener: jest.fn((name: string, callback: (event: { target: unknown }) => void) => listeners.set(name, callback)), removeEventListener: jest.fn((name: string) => listeners.delete(name)) }
    const pending = waitForTransition(element as unknown as HTMLElement, 100)
    listeners.get("transitionend")?.({ target: {} })
    listeners.get("transitionend")?.({ target: element })
    await pending
    expect(element.removeEventListener).toHaveBeenCalled()
  })

  it("covers browser error paths and keeps focus inside a container", async () => {
    const { trapFocus, getFocusableElements } = await import("../src")
    const first = { hidden: false, tabIndex: 0, getAttribute: () => null, focus: jest.fn() }
    const last = { hidden: false, tabIndex: 0, getAttribute: () => null, focus: jest.fn() }
    let activeElement: unknown = last
    const document = {
      activeElement,
      querySelectorAll: jest.fn(),
      documentElement: { style: { setProperty: jest.fn() } },
    }
    const handlers = new Map<string, (event: { key: string; shiftKey: boolean; preventDefault: jest.Mock }) => void>()
    const container = {
      querySelectorAll: jest.fn(() => [first, last]),
      contains: jest.fn((element: unknown) => element === first || element === last),
      addEventListener: jest.fn((name: string, handler: (event: { key: string; shiftKey: boolean; preventDefault: jest.Mock }) => void) => handlers.set(name, handler)),
      removeEventListener: jest.fn(),
    }
    setGlobal("document", document)
    const release = trapFocus(container as unknown as HTMLElement)
    const preventDefault = jest.fn()
    handlers.get("keydown")?.({ key: "Tab", shiftKey: false, preventDefault })
    expect(preventDefault).toHaveBeenCalled()
    expect(first.focus).toHaveBeenCalled()
    document.activeElement = first
    handlers.get("keydown")?.({ key: "Tab", shiftKey: true, preventDefault: jest.fn() })
    expect(last.focus).toHaveBeenCalled()
    release()
    expect(container.removeEventListener).toHaveBeenCalled()
    expect(getFocusableElements(container as unknown as ParentNode)).toEqual([first, last])

    setGlobal("localStorage", { getItem: () => { throw new Error("blocked") }, setItem: () => { throw new Error("blocked") }, removeItem: () => { throw new Error("blocked") } })
    expect(getStorageItem("x", "fallback")).toBe("fallback")
    expect(setStorageItem("x", 1)).toBe(false)
    expect(removeStorageItem("x")).toBe(false)
    expect(() => waitForTransition(container as unknown as HTMLElement, -1)).toThrow(RangeError)
  })
})
