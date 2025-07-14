import { EventEmitter } from "../src"

describe("EventEmitter", () => {
  let emitter: EventEmitter<Record<string, any>>

  beforeEach(() => {
    emitter = new EventEmitter()
  })

  // 1. Тестирование базовой функциональности
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

  // 2. Тестирование once()
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

  // 4. Тестирование clear()
  describe("Метод clear()", () => {
    test("удаляет все обработчики для указанного события", () => {
      emitter.on("test1", () => {})
      emitter.on("test2", () => {})

      emitter.clear("test1")

      expect(emitter.e["test1"]?.length ?? 0).toBe(0)
      expect(emitter.e["test2"].length).toBe(1)
    })

    test("удаляет все обработчики для всех событий", () => {
      emitter.on("test1", () => {})
      emitter.on("test2", () => {})

      emitter.clear()

      expect(emitter.e["test1"]?.length ?? 0).toBe(0)
      expect(emitter.e["test2"]?.length ?? 0).toBe(0)
    })
  })

  // 5. Тестирование ошибок
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
  })

  // 6. Тестирование памяти и производительности
  describe("Оптимизации памяти", () => {
    test("удаление пустых массивов обработчиков", () => {
      const callback = () => {}
      emitter.on("test", callback)

      emitter.off("test", callback)

      // Проверяем, что массив обработчиков удален
      expect("test" in emitter).toBe(false)
    })
  })

  // 7. Тестирование аргументов
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
  })
})
