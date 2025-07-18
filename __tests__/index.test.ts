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
  comparison,
  unlink,
  parseVersionString,
  updateCurrent,
  DataKeeper,
} from "../src"

describe("DataKeeper", () => {
  // Тест с примитивным значением (число)
  describe("Работа с примитивом (number)", () => {
    let keeper: DataKeeper<number>

    beforeEach(() => {
      keeper = new DataKeeper(42)
    })

    it("Должен инициализироваться с правильным значением", () => {
      expect(keeper.initValue).toBe(42)
      expect(keeper.currentValue).toBe(42)
    })

    it("Должен обнаруживать изменение после setter", () => {
      keeper.setter((val) => val + 10)
      expect(keeper.currentValue).toBe(52)
      expect(keeper.isModified()).toBe(true)
    })

    it("Должен сбрасывать значение при reset", () => {
      keeper.setter((val) => val * 2)
      keeper.reset(42)
      expect(keeper.currentValue).toBe(42)
      expect(keeper.isModified()).toBe(false)
    })
  })

  // Тест с объектом
  describe("Работа с объектом", () => {
    let keeper: DataKeeper<{ name: string; age: number }>

    beforeEach(() => {
      keeper = new DataKeeper({ name: "Алиса", age: 25 })
    })

    it("Должен обнаруживать изменение поля объекта", () => {
      keeper.setter((val) => ({ ...val, age: 30 }))
      expect(keeper.currentValue.age).toBe(30)
      expect(keeper.isModified()).toBe(true)
    })

    it("Не должен считать изменением создание нового объекта с теми же данными", () => {
      keeper.setter((val) => ({ ...val })) // Новый объект, но данные те же
      expect(keeper.isModified()).toBe(false)
    })

    it("Должен сбрасывать объект к начальному состоянию", () => {
      keeper.setter((val) => ({ name: "Боб", age: 30 }))
      keeper.reset({ name: "Алиса", age: 25 })
      expect(keeper.currentValue).toEqual({ name: "Алиса", age: 25 })
    })
  })

  // Тест с массивом
  describe("Работа с массивом", () => {
    let keeper: DataKeeper<number[]>

    beforeEach(() => {
      keeper = new DataKeeper([1, 2, 3])
    })

    it("Должен обнаруживать изменение массива", () => {
      keeper.setter((arr) => [...arr, 4])
      expect(keeper.currentValue).toEqual([1, 2, 3, 4])
      expect(keeper.isModified()).toBe(true)
    })

    it("Не должен считать изменением создание нового массива с теми же элементами", () => {
      keeper.setter((arr) => [...arr]) // Новый массив, но данные те же
      expect(keeper.isModified()).toBe(false)
    })
  })

  // Тест с вложенным объектом (глубокое сравнение)
  describe("Работа с вложенным объектом", () => {
    let keeper: DataKeeper<{ user: { id: number; name: string } }>

    beforeEach(() => {
      keeper = new DataKeeper({ user: { id: 1, name: "Алиса" } })
    })

    it("Должен обнаруживать изменение вложенного поля", () => {
      keeper.setter((val) => ({
        ...val,
        user: { ...val.user, name: "Боб" },
      }))
      expect(keeper.currentValue.user.name).toBe("Боб")
      expect(keeper.isModified()).toBe(true)
    })
  })
  // Тест с Map
  describe("Работа с Map", () => {
    let keeper: DataKeeper<Map<string, number>>
    let initialMap: Map<string, number>

    beforeEach(() => {
      initialMap = new Map([
        ["a", 1],
        ["b", 2],
      ])
      keeper = new DataKeeper(new Map(initialMap))
    })

    it("Должен корректно инициализировать Map", () => {
      expect(keeper.currentValue).toBeInstanceOf(Map)
      expect(Array.from(keeper.currentValue.entries())).toEqual([
        ["a", 1],
        ["b", 2],
      ])
    })

    it("Должен обнаруживать изменение Map (добавление элемента)", () => {
      keeper.setter((map) => {
        const newMap = new Map(map)
        newMap.set("c", 3)
        return newMap
      })
      expect(keeper.currentValue.size).toBe(3)
      expect(keeper.isModified()).toBe(true)
    })

    it("Не должен считать изменением создание нового Map с теми же данными", () => {
      keeper.setter((map) => new Map(map)) // Новый Map, но данные те же
      expect(keeper.isModified()).toBe(false)
    })

    it("Должен сбрасывать Map к начальному состоянию", () => {
      keeper.setter((map) => {
        const newMap = new Map(map)
        newMap.set("c", 3)
        return newMap
      })
      keeper.reset(new Map(initialMap))
      expect(Array.from(keeper.currentValue.entries())).toEqual([
        ["a", 1],
        ["b", 2],
      ])
    })
  })

  // Тест с Set
  describe("Работа с Set", () => {
    let keeper: DataKeeper<Set<number>>
    let initialSet: Set<number>

    beforeEach(() => {
      initialSet = new Set([1, 2, 3])
      keeper = new DataKeeper(new Set(initialSet))
    })

    it("Должен корректно инициализировать Set", () => {
      expect(keeper.currentValue).toBeInstanceOf(Set)
      expect(Array.from(keeper.currentValue.values())).toEqual([1, 2, 3])
    })

    it("Должен обнаруживать изменение Set (добавление элемента)", () => {
      keeper.setter((set) => {
        const newSet = new Set(set)
        newSet.add(4)
        return newSet
      })
      expect(keeper.currentValue.size).toBe(4)
      expect(keeper.isModified()).toBe(true)
    })

    it("Не должен считать изменением создание нового Set с теми же данными", () => {
      keeper.setter((set) => new Set(set)) // Новый Set, но данные те же
      expect(keeper.isModified()).toBe(false)
    })

    it("Должен сбрасывать Set к начальному состоянию", () => {
      keeper.setter((set) => {
        const newSet = new Set(set)
        newSet.add(4)
        return newSet
      })
      keeper.reset(new Set(initialSet))
      expect(Array.from(keeper.currentValue.values())).toEqual([1, 2, 3])
    })
  })
})

describe("updateCurrent", () => {
  it("should merge simple fields", () => {
    const current = { a: 1, b: 2 }
    const next = { b: 3, c: 4 }
    expect(updateCurrent(current, next)).toEqual({ a: 1, b: 2, c: 4 })
  })

  it("should handle undefined/null in current state", () => {
    const current = { a: undefined, b: null, c: 1 }
    const next = { a: 2, b: 3, d: 4 }
    expect(updateCurrent(current, next)).toEqual({ a: 2, b: 3, c: 1, d: 4 })
  })

  it("should deeply merge nested objects", () => {
    const current = { a: { b: 1, c: { d: 2 } } }
    const next = { a: { c: { e: 3 }, f: 4 } }
    expect(updateCurrent(current, next)).toEqual({
      a: { b: 1, c: { d: 2, e: 3 }, f: 4 },
    })
  })

  it("should concatenate arrays by default", () => {
    const current = { arr: [1, 2], nested: { arr: ["a"] } }
    const next = { arr: [3, 4], nested: { arr: ["b"] } }
    expect(updateCurrent(current, next)).toEqual({
      arr: [1, 2],
      nested: { arr: ["a"] },
    })
  })

  it("should not mutate the original objects", () => {
    const current = { a: { b: 1 } }
    const next = { a: { c: 2 } }
    const result = updateCurrent(current, next)
    expect(current).toEqual({ a: { b: 1 } }) // Проверяем, что current не изменился
    expect(result).toEqual({ a: { b: 1, c: 2 } })
  })

  it("should handle empty objects", () => {
    expect(updateCurrent({}, { a: 1 })).toEqual({ a: 1 })
    expect(updateCurrent({ a: 1 }, {})).toEqual({ a: 1 })
  })

  it("should work with your example", () => {
    const currentState = {
      a: 1,
      b: 2,
      test: { id: 1, array: [1, 2, 3] },
      c: undefined,
    }
    const nextState = {
      b: 3,
      c: 4,
      test: { id: 2, a: 2, array: [1, 2, 3, 4] },
    }
    expect(updateCurrent(currentState, nextState)).toEqual({
      a: 1,
      b: 2,
      test: { id: 1, array: [1, 2, 3, 4], a: 2 },
      c: 4,
    })
  })
})

describe("Utils", () => {
  it("comparison", async () => {
    expect(comparison({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })).toEqual(
      true,
    )

    expect(comparison({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 3 } })).toEqual(
      false,
    )
    expect(
      comparison({ a: 1, b: { c: 2 } }, { a: 1, b: { c: { c: 3 } } }),
    ).toEqual(false)

    expect(
      comparison(
        { a: 1, b: { c: [{ a: 1, b: { c: 2 } }, [{ a: 1, b: { c: 2 } }]] } },
        { a: 1, b: { c: [{ a: 1, b: { c: 2 } }, [{ a: 1, b: { c: 2 } }]] } },
      ),
    ).toEqual(true)

    expect(
      comparison(
        { a: 1, b: { c: [{ a: 1, b: { c: 2 } }, [{ a: 1, b: { c: 2 } }]] } },
        { a: 1, b: { c: [{ a: 1, b: { c: 2 } }, [{ a: 2, b: { c: 2 } }]] } },
      ),
    ).toEqual(false)

    expect(comparison([1, 2, 3], [1, 2, 3])).toEqual(true)

    expect(comparison([1, 2, 3], [2, 1, 3])).toEqual(false)

    expect(
      comparison({ a: 1, b: { c: [1, 2, 3] } }, { a: 1, b: { c: [1, 2, 3] } }),
    ).toEqual(true)

    expect(
      comparison({ a: 1, b: { c: [1, 2, 3] } }, { a: 1, b: { c: [2, 1, 3] } }),
    ).toEqual(false)

    expect(comparison("1", "1")).toEqual(true)
    expect(comparison(1, "1" as any)).toEqual(false)
    expect(comparison(1, 1)).toEqual(true)
    expect(
      comparison(
        new Map([
          [1, 1],
          [2, 2],
        ]),
        new Map([
          [1, 1],
          [2, 2],
        ]),
      ),
    ).toEqual(true)

    expect(
      comparison(
        new Map([
          [1, 1],
          [2, 2],
        ]),
        new Map([
          [1, 1],
          [2, 4],
        ]),
      ),
    ).toEqual(false)

    expect(
      comparison(
        new Map([
          [1, { id: 1 }],
          [2, { id: 2 }],
        ]),
        new Map([
          [1, { id: 2 }],
          [2, { id: 1 }],
        ]),
      ),
    ).toEqual(false)

    expect(
      comparison(
        new Map([
          [1, { id: 1 }],
          [2, { id: 2 }],
        ]),
        new Map([
          [1, { id: 1 }],
          [2, { id: 2 }],
        ]),
      ),
    ).toEqual(true)

    expect(comparison(new Set([1, 2, 3, 4]), new Set([1, 2, 3, 4]))).toEqual(
      true,
    )

    expect(comparison(new Set([1, 2, 3, 4]), new Set([1, 3, 3, 4]))).toEqual(
      false,
    )

    // const objA: Record<string, any> = { a: 1 }
    // objA.self = objA
    // const objB: Record<string, any> = { a: 1 }
    // objB.self = objB
    // expect(comparison(objA, objB)).toEqual(true)

    // const objC: Record<string, any> = { a: 1 }
    // objC.self = objC
    // const objD: Record<string, any> = { a: 1 }
    // objD.self = { a: 1, self: objD }
    // expect(comparison(objC, objD)).toEqual(false)

    // expect(comparison(NaN, NaN)).toEqual(true)
    // expect(comparison(0, -0)).toEqual(false)
    // expect(comparison(Infinity, Infinity)).toEqual(true)
    // expect(comparison(-Infinity, Infinity)).toEqual(false)

    // // 4. Set объекты
    // const set1 = new Set([1, 2, 3])
    // const set2 = new Set([1, 2, 3])
    // const set4 = new Set([1, 2, 4])
    // expect(comparison(set1, set2)).toEqual(true)
    // expect(comparison(set1, set4)).toEqual(false)

    // // 6. Символы как ключи свойств
    // const sym1 = Symbol("test")
    // const sym2 = Symbol("test")
    // const objWithSymbol1 = { [sym1]: 1 }
    // const objWithSymbol2 = { [sym1]: 1 }
    // const objWithSymbol3 = { [sym2]: 1 }
    // expect(comparison(objWithSymbol1, objWithSymbol2)).toEqual(true)
    // expect(comparison(objWithSymbol1, objWithSymbol3 as any)).toEqual(false)

    // // 7. Геттеры и сеттеры
    // const objWithGetter1 = {
    //   get value() {
    //     return 42
    //   },
    // }
    // const objWithGetter2 = {
    //   get value() {
    //     return 42
    //   },
    // }
    // const objWithGetter3 = {
    //   get value() {
    //     return 43
    //   },
    // }
    // expect(comparison(objWithGetter1, objWithGetter2)).toEqual(true)
    // expect(comparison(objWithGetter1, objWithGetter3)).toEqual(false)

    // // 8. Разные прототипы
    // const objProto1 = Object.create({ protoProp: 1 })
    // const objProto2 = Object.create({ protoProp: 1 })
    // const objProto3 = Object.create({ protoProp: 2 })
    // expect(comparison(objProto1, objProto2)).toEqual(true)
    // expect(comparison(objProto1, objProto3)).toEqual(false)

    // // 9. Объекты с undefined/null значениями
    // expect(comparison({ a: undefined }, { a: undefined })).toEqual(true)
    // expect(comparison({ a: undefined }, { a: null })).toEqual(false)
    // expect(comparison({ a: null }, { a: null })).toEqual(true)

    // // 10. Разные типы коллекций
    // const map = new Map([[1, "one"]])
    // const set = new Set([1])
    // expect(comparison(map, set as any)).toEqual(false)

    // // 11. Объекты с разным порядком свойств
    // const ordered1 = { a: 1, b: 2 }
    // const ordered2 = { b: 2, a: 1 }
    // expect(comparison(ordered1, ordered2)).toEqual(true)

    // // 12. Промисы (должны сравниваться по ссылке)
    // const promise1 = Promise.resolve(42)
    // const promise2 = Promise.resolve(42)
    // expect(comparison(promise1, promise1)).toEqual(true)
    // expect(comparison(promise1, promise2)).toEqual(false)
  })
  it("unlink", async () => {
    const data = {
      id: 1,
      history: new Map([
        [1, 2],
        [2, 1],
      ]),
    }

    const data2 = unlink(data)
    data.id = 2

    expect(comparison(data2, data)).toEqual(false)
  })

  it("parseVersionString", async () => {
    expect(parseVersionString("1.2.3-test")).toEqual({
      major: 1,
      minor: 2,
      patch: 3,
      prerelease: "test",
    })
    expect(parseVersionString("1.*.*-test")).toEqual({
      major: 1,
      minor: "*",
      patch: "*",
      prerelease: "test",
    })
  })

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
