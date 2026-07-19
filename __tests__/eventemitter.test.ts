import { EventEmitter } from "../src"

// Расширяем EventEmitter для тестов, чтобы получить доступ к приватным полям
interface TestEventEmitter extends EventEmitter<Record<string, any>> {
  pendingEvents: Record<string, any[][]>
  e: Record<string, any[]>
}

describe("EventEmitter", () => {
  let emitter: TestEventEmitter

  beforeEach(() => {
    emitter = new EventEmitter() as TestEventEmitter
  })

  describe("Базовые методы", () => {
    test("подписка и вызов события", () => {
      const mockCallback = jest.fn()
      emitter.on("test", mockCallback)
      emitter.emit("test", "data")

      expect(mockCallback).toHaveBeenCalledWith("data")
    })

    test("подписка и отписка от события", () => {
      const mockCallback = jest.fn()
      const unsubscribe = emitter.on("test", mockCallback)

      emitter.emit("test")
      unsubscribe()
      emitter.emit("test")

      expect(mockCallback).toHaveBeenCalledTimes(1)
    })

    test("вызов события без подписчиков не вызывает ошибок", () => {
      expect(() => emitter.emit("no-listeners")).not.toThrow()
    })
  })

  describe("Метод once()", () => {
    test("обработчик вызывается только один раз", () => {
      const mockCallback = jest.fn()
      emitter.once("single", mockCallback)

      emitter.emit("single")
      emitter.emit("single")

      expect(mockCallback).toHaveBeenCalledTimes(1)
    })

    test("отписка работает корректно", () => {
      const mockCallback = jest.fn()
      const unsubscribe = emitter.once("single", mockCallback)

      unsubscribe()
      emitter.emit("single")

      expect(mockCallback).not.toHaveBeenCalled()
    })
  })

  describe("Метод emitWithDefer()", () => {
    test("сохраняет событие в буфер, если нет подписчиков", () => {
      const mockCallback = jest.fn()

      emitter.emitWithDefer("deferred", "data1", "data2")
      expect(emitter.pendingEvents["deferred"]).toBeDefined()
      expect(emitter.pendingEvents["deferred"].length).toBe(1)

      emitter.on("deferred", mockCallback)

      expect(mockCallback).toHaveBeenCalledWith("data1", "data2")
      expect(emitter.pendingEvents["deferred"]).toBeUndefined()
    })

    test("отправляет несколько отложенных событий при появлении подписчика", () => {
      const mockCallback = jest.fn()

      emitter.emitWithDefer("multi", 1)
      emitter.emitWithDefer("multi", 2)
      emitter.emitWithDefer("multi", 3)

      expect(emitter.pendingEvents["multi"].length).toBe(3)

      emitter.on("multi", mockCallback)

      expect(mockCallback).toHaveBeenCalledTimes(3)
      expect(mockCallback).toHaveBeenNthCalledWith(1, 1)
      expect(mockCallback).toHaveBeenNthCalledWith(2, 2)
      expect(mockCallback).toHaveBeenNthCalledWith(3, 3)
    })

    test("emitWithDefer отправляет сразу, если подписчики уже есть", () => {
      const mockCallback = jest.fn()
      emitter.on("immediate", mockCallback)

      emitter.emitWithDefer("immediate", "test")

      expect(mockCallback).toHaveBeenCalledWith("test")
      expect(emitter.pendingEvents["immediate"]).toBeUndefined()
    })

    test("обычный emit не сохраняет события без подписчиков", () => {
      emitter.emit("normal", "data")

      expect(emitter.pendingEvents["normal"]).toBeUndefined()
    })

    test("отложенные события разных типов не перемешиваются", () => {
      const callback1 = jest.fn()
      const callback2 = jest.fn()

      emitter.emitWithDefer("event1", "A")
      emitter.emitWithDefer("event2", "B")
      emitter.emitWithDefer("event1", "C")

      emitter.on("event1", callback1)

      expect(callback1).toHaveBeenCalledTimes(2)
      expect(callback1).toHaveBeenCalledWith("A")
      expect(callback1).toHaveBeenCalledWith("C")
      expect(emitter.pendingEvents["event2"]).toBeDefined()
      expect(emitter.pendingEvents["event2"].length).toBe(1)

      // Очищаем для следующего теста
      emitter.on("event2", callback2)
      expect(callback2).toHaveBeenCalledWith("B")
    })
  })

  describe("Метод clear()", () => {
    test("удаляет все обработчики для указанного события", () => {
      emitter.on("test1", () => {})
      emitter.on("test2", () => {})

      emitter.clear("test1")

      expect(emitter.e["test1"]?.length ?? 0).toBe(0)
      expect(emitter.e["test2"]?.length ?? 0).toBe(1)
    })

    test("удаляет все обработчики для всех событий", () => {
      emitter.on("test1", () => {})
      emitter.on("test2", () => {})

      emitter.clear()

      expect(emitter.e["test1"]?.length ?? 0).toBe(0)
      expect(emitter.e["test2"]?.length ?? 0).toBe(0)
    })

    test("clear также очищает отложенные события", () => {
      emitter.emitWithDefer("deferred1", "data1")
      emitter.emitWithDefer("deferred2", "data2")

      emitter.clear("deferred1")

      expect(emitter.pendingEvents["deferred1"]).toBeUndefined()
      expect(emitter.pendingEvents["deferred2"]).toBeDefined()

      emitter.clear()

      expect(emitter.pendingEvents["deferred2"]).toBeUndefined()
    })
  })

  describe("Обработка ошибок", () => {
    test("ошибка в обработчике не прерывает выполнение других обработчиков", () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {})
      const badCallback = () => {
        throw new Error("Test error")
      }
      const goodCallback = jest.fn()

      emitter.on("error-test", badCallback)
      emitter.on("error-test", goodCallback)

      expect(() => emitter.emit("error-test")).not.toThrow()
      expect(goodCallback).toHaveBeenCalled()
      expect(consoleSpy).toHaveBeenCalled()

      consoleSpy.mockRestore()
    })

    test("ошибка в отложенном событии при отправке не прерывает другие", () => {
      const consoleSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {})

      const goodCallback = jest.fn()
      const badCallback = jest.fn().mockImplementation(() => {
        throw new Error("Test error")
      })

      // Сначала подписываемся на событие
      emitter.on("error-batch", badCallback)
      emitter.on("error-batch", goodCallback)

      // Теперь отправляем события (уже есть подписчики)
      emitter.emitWithDefer("error-batch", "data1")
      emitter.emitWithDefer("error-batch", "data2")

      // Проверяем, что оба обработчика были вызваны для каждого события
      expect(badCallback).toHaveBeenCalledTimes(2)
      expect(goodCallback).toHaveBeenCalledTimes(2)
      expect(consoleSpy).toHaveBeenCalledTimes(2)

      consoleSpy.mockRestore()
    })
  })

  describe("Оптимизации памяти", () => {
    test("удаление пустых массивов обработчиков", () => {
      const callback = () => {}
      emitter.on("test", callback)

      emitter.off("test", callback)

      expect(emitter.e["test"]).toBeUndefined()
    })

    test("очистка буфера после отправки отложенных событий", () => {
      emitter.emitWithDefer("clean", "data")
      expect(emitter.pendingEvents["clean"]).toBeDefined()

      emitter.on("clean", () => {})

      expect(emitter.pendingEvents["clean"]).toBeUndefined()
    })
  })

  describe("Передача аргументов", () => {
    test("корректная передача нескольких аргументов", () => {
      const mockCallback = jest.fn()
      emitter.on("args-test", mockCallback)

      emitter.emit("args-test", 1, "two", { three: 3 })

      expect(mockCallback).toHaveBeenCalledWith(1, "two", { three: 3 })
    })

    test("вызов без аргументов", () => {
      const mockCallback = jest.fn()
      emitter.on("no-args", mockCallback)

      emitter.emit("no-args")

      expect(mockCallback).toHaveBeenCalledWith()
    })

    test("emitWithDefer корректно передает аргументы", () => {
      const mockCallback = jest.fn()

      emitter.emitWithDefer("defer-args", "string", 42, { key: "value" })
      emitter.on("defer-args", mockCallback)

      expect(mockCallback).toHaveBeenCalledWith("string", 42, { key: "value" })
    })
  })

  describe("Сложные сценарии", () => {
    test("смешанное использование emit и emitWithDefer", () => {
      const callback = jest.fn()

      emitter.emitWithDefer("mixed", "deferred1")
      emitter.emit("mixed", "ignored")
      emitter.emitWithDefer("mixed", "deferred2")

      emitter.on("mixed", callback)

      expect(callback).toHaveBeenCalledTimes(2)
      expect(callback).toHaveBeenCalledWith("deferred1")
      expect(callback).toHaveBeenCalledWith("deferred2")
    })

    test("несколько подписчиков на одно событие", () => {
      const callback1 = jest.fn()
      const callback2 = jest.fn()

      // Сначала подписываемся
      emitter.on("multi-sub", callback1)
      emitter.on("multi-sub", callback2)

      // Потом отправляем событие
      emitter.emitWithDefer("multi-sub", "data")

      expect(callback1).toHaveBeenCalledWith("data")
      expect(callback2).toHaveBeenCalledWith("data")
      expect(callback1).toHaveBeenCalledTimes(1)
      expect(callback2).toHaveBeenCalledTimes(1)
    })

    test("отложенные события с once", () => {
      const callback = jest.fn()

      emitter.emitWithDefer("once-defer", "first")
      emitter.emitWithDefer("once-defer", "second")
      emitter.emitWithDefer("once-defer", "third")

      emitter.once("once-defer", callback)

      // once должен сработать только на первом отложенном событии
      expect(callback).toHaveBeenCalledTimes(1)
      expect(callback).toHaveBeenCalledWith("first")

      // Проверяем, что second и third остались в буфере
      expect(emitter.pendingEvents["once-defer"]).toBeDefined()
      expect(emitter.pendingEvents["once-defer"].length).toBe(2)
      expect(emitter.pendingEvents["once-defer"][0]).toEqual(["second"])
      expect(emitter.pendingEvents["once-defer"][1]).toEqual(["third"])
    })

    test("обрабатывает ошибку и очищает единственное отложенное once-событие", () => {
      const error = jest.spyOn(console, "error").mockImplementation(() => {})
      emitter.emitWithDefer("bad-pending", "value")
      emitter.on("bad-pending", () => { throw new Error("bad") })
      expect(error).toHaveBeenCalled()

      emitter.emitWithDefer("single-once", "value")
      emitter.once("single-once", jest.fn())
      expect(emitter.pendingEvents["single-once"]).toBeUndefined()
      error.mockRestore()
    })
  })
})
