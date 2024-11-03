import {
  alignTo,
  chunks,
  clamp,
  createLinksFromText,
  decWord,
  formatNumber,
  isType,
  omit,
  pick,
  timeAgo,
  toShort,
} from "../src"

describe("Utils", () => {
  it("clamp", async () => {
    expect(clamp(100, 50, 100)).toEqual(100)
    expect(clamp(75, 50, 100)).toEqual(75)
    expect(clamp(150, 50, 100)).toEqual(100)
    expect(clamp(0, 50, 100)).toEqual(50)
    expect(clamp(-100, 50, 100)).toEqual(50)
  })

  it("decWord", async () => {
    expect(decWord(1, ["рубль", "рубля", "рублей"])).toEqual("рубль")
    expect(decWord(2, ["рубль", "рубля", "рублей"])).toEqual("рубля")
    expect(decWord(5, ["рубль", "рубля", "рублей"])).toEqual("рублей")
    expect(decWord(11, ["рубль", "рубля", "рублей"])).toEqual("рублей")
    expect(decWord(211, ["рубль", "рубля", "рублей"])).toEqual("рублей")
  })

  it("chunks", async () => {
    const array = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    ]

    expect(chunks(2, array)).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
      [7, 8],
      [9, 10],
      [11, 12],
      [13, 14],
      [15, 16],
      [17, 18],
      [19, 20],
      [21],
    ])
    expect(chunks(4, array)).toEqual([
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 11, 12],
      [13, 14, 15, 16],
      [17, 18, 19, 20],
      [21],
    ])
    expect(chunks(10, array)).toEqual([
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      [21],
    ])
    expect(chunks(20, array)).toEqual([
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      [21],
    ])
    expect(chunks(21, array)).toEqual([
      [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21,
      ],
    ])
    expect(chunks(25, array)).toEqual([
      [
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21,
      ],
    ])
  })

  it("timeAgo", async () => {
    const date = new Date("07.10.2020")
    const [second, minute, hour, day] = [
      1000,
      60 * 1000,
      60 * 60 * 1000,
      24 * 60 * 60 * 1000,
    ]
    const initDate = (value: number) => new Date(Date.now() - value).getTime()
    const staticDate = (value: number) => date.getTime() + value

    expect(timeAgo(initDate(second))).toEqual("1 секунду назад")
    expect(timeAgo(initDate(30 * second))).toEqual("30 секунд назад")
    expect(timeAgo(initDate(minute))).toEqual("1 минуту назад")
    expect(timeAgo(initDate(59 * minute))).toEqual("59 минут назад")
    expect(timeAgo(initDate(hour))).toEqual("час назад")
    expect(timeAgo(initDate(2 * hour))).toEqual("два часа назад")
    expect(timeAgo(initDate(3 * hour))).toEqual("три часа назад")
    expect(timeAgo(staticDate(0))).toEqual("10 июл 2020 г. ")
    expect(timeAgo(staticDate(day * 4))).toEqual("14 июл 2020 г. ")
    expect(timeAgo(staticDate(day * 10))).toEqual("20 июл 2020 г. ")
    expect(timeAgo(new Date("01.01.1997").getTime())).toEqual("1 янв 1997 г. ")
  })

  it("toShort", async () => {
    expect(toShort(1)).toEqual("1")
    expect(toShort(1000)).toEqual("1k")
    expect(toShort(10000)).toEqual("10k")
    expect(toShort(100000)).toEqual("100k")
    expect(toShort(1000000)).toEqual("1M")
    expect(toShort(1000001)).toEqual("1M")
    expect(toShort(1010001)).toEqual("1M")
    expect(toShort(9000001)).toEqual("9M")
    expect(toShort(9100000, undefined, 0)).toEqual("9M")
    expect(toShort(9100000)).toEqual("9.1M")
    expect(toShort(9900000)).toEqual("9.9M")
  })

  it("alignTo", async () => {
    expect(alignTo(1, 4)).toEqual(4)
    expect(alignTo(2, 4)).toEqual(4)
    expect(alignTo(3, 4)).toEqual(4)
    expect(alignTo(4, 4)).toEqual(4)
    expect(alignTo(5, 4)).toEqual(8)
    expect(alignTo(9, 4)).toEqual(12)
  })

  it("formatNumber", async () => {
    expect(formatNumber(100_000)).toEqual("100.000")
    expect(formatNumber(1_100_000)).toEqual("1.100.000")
    expect(formatNumber(333_000)).toEqual("333.000")
  })

  it("isType", async () => {
    expect(isType(new Map())).toEqual("map")
    expect(isType(new Set())).toEqual("set")
    expect(isType(new Date())).toEqual("date")
    expect(isType(new Error())).toEqual("error")
    expect(isType(new RegExp(""))).toEqual("regexp")
    expect(isType(new WeakMap())).toEqual("weakmap")
    expect(isType(new WeakSet())).toEqual("weakset")
    expect(
      isType(
        new Promise((resolve) => {
          resolve(true)
        }),
      ),
    ).toEqual("promise")
    expect(isType(new Buffer([]))).toEqual("buffer")
    expect(isType(undefined)).toEqual("undefined")
    expect(isType("test")).toEqual("string")
    expect(isType(0)).toEqual("number")
    expect(isType(1n)).toEqual("bigint")
    expect(isType(NaN)).toEqual("nan")
    expect(isType(true)).toEqual("boolean")
    expect(isType([])).toEqual("array")
    expect(isType({})).toEqual("object")
    expect(isType(() => {})).toEqual("function")
    expect(isType(null)).toEqual("null")
    expect(isType(Symbol())).toEqual("symbol")
  })

  it("omit", async () => {
    expect(omit({ key: 1, id: 2 }, ["id"])).toEqual({ key: 1 })
  })
  it("pick", async () => {
    expect(pick({ key: 1, id: 2 }, ["id"])).toEqual({ id: 2 })
  })
  it("createLinksFromText", async () => {
    expect(
      createLinksFromText(
        "Hello {{key1:text}} {{key2:text}}!",
        (key, value) => {
          return `${key}:${value}`
        },
      ),
    ).toEqual(["Hello ", "key1:text", " ", "key2:text", "!"])
  })
})
