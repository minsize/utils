import {
  HEXtoRGB,
  HSVtoRGB,
  RGBtoHSV,
  alignTo,
  comparison,
  createAbortTimeout,
  debounce,
  formatBytes,
  formatDuration,
  generateUniqueKey,
  getChangedData,
  isType,
  orderBy,
  random,
  randomByWeight,
  retry,
  throttle,
  timeAgo,
  unlink,
  updateCurrent,
  withTimeout,
} from "../src"

describe("additional behavioural cases", () => {
  it("covers every color conversion sector and invalid HEX input", () => {
    expect(HEXtoRGB("not-a-color")).toEqual([0, 0, 0])
    expect(HEXtoRGB("#gg0000")).toEqual([0, 0, 0])
    expect(HSVtoRGB(1 / 6, 1, 1)).toEqual([255, 255, 0])
    expect(HSVtoRGB(2 / 6, 1, 1)).toEqual([0, 255, 0])
    expect(HSVtoRGB(3 / 6, 1, 1)).toEqual([0, 255, 255])
    expect(HSVtoRGB(4 / 6, 1, 1)).toEqual([0, 0, 255])
    expect(HSVtoRGB(5 / 6, 1, 1)).toEqual([255, 0, 255])
    expect(RGBtoHSV(0, 0, 0)).toEqual([0, 0, 0])
    expect(RGBtoHSV(10, 20, 5)[0]).toBeGreaterThan(0.2)
    expect(RGBtoHSV(5, 10, 20)[0]).toBeGreaterThan(0.5)
  })

  it("covers ordering ties, reverse ordering and missing paths", () => {
    const values = [{ a: 2, nested: { v: 1 } }, { a: 1, nested: { v: 1 } }, { a: 1, nested: { v: 2 } }]
    expect(orderBy(values, { a: "desc", "nested.v": "asc" }).map((item) => item.a)).toEqual([2, 1, 1])
    expect(orderBy([{ value: 1 }, { value: 1 }], { value: "asc" })).toHaveLength(2)
    expect(orderBy([{ value: 1 }, {}], { "missing.path": "asc" } as never)).toHaveLength(2)
  })

  it("handles all time-ago ranges", () => {
    jest.useFakeTimers().setSystemTime(new Date("2025-06-15T12:00:00Z"))
    const now = Date.now()
    expect(timeAgo(0)).toBe("только что")
    expect(timeAgo(now + 1_000)).toBe("скоро")
    expect(timeAgo(now - 1_000)).toContain("секунду")
    expect(timeAgo(now - 120_000)).toContain("минуты")
    expect(timeAgo(now - 3_600_000)).toBe("час назад")
    expect(timeAgo(now - 7_200_000)).toBe("два часа назад")
    expect(timeAgo(now - 10_800_000)).toBe("три часа назад")
    expect(timeAgo(now - 5 * 3_600_000)).toContain("сегодня в")
    expect(timeAgo(now - 26 * 3_600_000)).toContain("вчера в")
    expect(timeAgo(now - 2 * 86_400_000)).toBe("два дня назад")
    expect(timeAgo(now - 3 * 86_400_000)).toBe("три дня назад")
    expect(timeAgo(now - 10 * 86_400_000)).toContain("в")
    expect(timeAgo(now - 400 * 86_400_000)).toContain("г.")
  })

  it("compares mismatches in all supported collection types", () => {
    const same = () => undefined
    expect(comparison({ a: 1 }, { b: 1 } as never)).toBe(false)
    expect(comparison([1], [2])).toBe(false)
    expect(comparison(same, (() => undefined) as never)).toBe(false)
    expect(comparison(new Date(1), new Date(2))).toBe(false)
    expect(comparison(new Map([["a", 1]]), new Map([["a", 2]]))).toBe(false)
    expect(comparison(new Set([1]), new Set([2]))).toBe(false)
    expect(comparison(1, 2)).toBe(false)
  })

  it("covers data structure changes and cloning types", () => {
    expect(getChangedData([1, 2], [1, 3, 4])).toEqual([, 3, 4])
    expect(getChangedData([1, 2], [1])).toEqual([, undefined])
    expect(getChangedData("a", "a")).toBeUndefined()
    expect(updateCurrent([1, undefined], [2, 3, 4])).toEqual([1, 3, 4])
    expect(updateCurrent(null, "next")).toBe("next")
    const map = new Map([["key", { nested: true }]])
    const set = new Set([1])
    expect(unlink(12)).toBe(12)
    expect(unlink("value")).toBe("value")
    expect(unlink(12n)).toBe(12n)
    expect(unlink(map)).not.toBe(map)
    expect(unlink(set)).not.toBe(set)
    expect(isType(NaN)).toBe("nan")
    expect(isType(Buffer.from("x"))).toBe("buffer")
  })

  it("covers key generation fallbacks and numeric helpers", () => {
    expect(generateUniqueKey([])).toBe("b62")
    expect(generateUniqueKey(undefined)).toBe(generateUniqueKey(undefined))
    const cyclic: { self?: unknown } = {}
    cyclic.self = cyclic
    const warning = jest.spyOn(console, "warn").mockImplementation()
    expect(generateUniqueKey(cyclic)).toEqual(expect.any(String))
    warning.mockRestore()
    expect(alignTo(0, 4)).toBe(4)
    expect(formatBytes(0)).toBe("0 B")
    expect(() => formatBytes(1, -1)).toThrow(RangeError)
    expect(formatDuration(0)).toBe("0ms")
    expect(formatDuration(86_461_000)).toBe("1d 1m 1s")
    expect(() => formatDuration(-1)).toThrow(RangeError)
    expect(() => random(2, 1, 1)).toThrow("Минимальная")
    expect(random(1, 3)).toBeGreaterThanOrEqual(1)
    expect(() => randomByWeight({})).toThrow(RangeError)
    expect(() => randomByWeight({ a: 0 })).toThrow(RangeError)
  })

  it("covers scheduling validation, cancellation and rejection branches", async () => {
    jest.useFakeTimers()
    expect(() => createAbortTimeout(-1)).toThrow(RangeError)
    const signal = createAbortTimeout(5)
    jest.advanceTimersByTime(5)
    expect(signal.aborted).toBe(true)
    expect(() => debounce(() => undefined, -1)).toThrow(RangeError)
    const debounced = debounce((value: number) => value * 2, 10)
    expect(debounced.flush()).toBeUndefined()
    debounced(2)
    expect(debounced.pending()).toBe(true)
    debounced.cancel()
    expect(debounced.pending()).toBe(false)
    expect(() => throttle(() => undefined, -1)).toThrow(RangeError)
    const throttled = throttle((value: number) => value, 10)
    throttled(1)
    throttled(2)
    expect(throttled.pending()).toBe(true)
    expect(throttled.flush()).toBe(2)
    throttled(3)
    throttled.cancel()
    expect(throttled.pending()).toBe(false)
    expect(() => withTimeout(Promise.resolve(), -1)).toThrow(RangeError)
    await expect(withTimeout(Promise.reject(new Error("no")), 10)).rejects.toThrow("no")
    const rejected = retry(jest.fn().mockRejectedValue(new Error("no")), 0, 0)
    await expect(rejected).rejects.toThrow("no")
  })
})
