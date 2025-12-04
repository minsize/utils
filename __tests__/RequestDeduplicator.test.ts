import { RequestDeduplicator } from "../src"

describe("RequestDeduplicator", () => {
  it("should deduplicate simultaneous requests", async () => {
    let requestCount = 0
    const deduplicator = new RequestDeduplicator()
    const key = "test-key"

    const callback = async () => {
      requestCount++
      await new Promise((resolve) => setTimeout(resolve, 100))
      return { data: "test", requestId: requestCount }
    }

    // Запускаем 3 одновременных запроса
    const promises = [
      deduplicator.fetch(key, callback),
      deduplicator.fetch(key, callback),
      deduplicator.fetch(key, callback),
    ]

    const results = await Promise.all(promises)

    // Должен быть выполнен только один реальный запрос
    expect(requestCount).toBe(1)

    // Все промисы должны вернуть одинаковый результат
    expect(results[0]).toEqual({ data: "test", requestId: 1 })
    expect(results[1]).toEqual(results[0])
    expect(results[2]).toEqual(results[0])
  })

  it("should handle different keys independently", async () => {
    let requestCount = 0
    const deduplicator = new RequestDeduplicator()

    const callback = async (key: string) => {
      var requestId = requestCount++
      await new Promise((resolve) => setTimeout(resolve, 50))
      return { key, requestId }
    }

    // Запускаем запросы с разными ключами
    const results = await Promise.all([
      deduplicator.fetch("key1", () => callback("key1")),
      deduplicator.fetch("key2", () => callback("key2")),
      deduplicator.fetch("key1", () => callback("key1")),
    ])

    // Должно быть 2 реальных запроса (key1 и key2)
    expect(requestCount).toBe(2)

    // key1 должен быть одинаковым для двух запросов
    expect(results[0].key).toBe("key1")
    expect(results[2].key).toBe("key1")
    expect(results[0].requestId).toBe(0)
    expect(results[2].requestId).toBe(0) // Тот же requestId что и у первого

    // key2 должен быть отдельным
    expect(results[1].key).toBe("key2")
    expect(results[1].requestId).toBe(1)
  })

  it("should allow new request after previous completes", async () => {
    let requestCount = 0
    const deduplicator = new RequestDeduplicator()
    const key = "test-key"

    const callback = async () => {
      requestCount++
      await new Promise((resolve) => setTimeout(resolve, 50))
      return `result-${requestCount}`
    }

    // Первая группа запросов
    const firstBatch = await Promise.all([
      deduplicator.fetch(key, callback),
      deduplicator.fetch(key, callback),
    ])

    expect(requestCount).toBe(1)
    expect(firstBatch[0]).toBe("result-1")
    expect(firstBatch[1]).toBe("result-1")

    // Ждем завершения первого запроса
    await new Promise((resolve) => setTimeout(resolve, 10))

    // Вторая группа запросов - должен выполниться новый запрос
    const secondBatch = await Promise.all([
      deduplicator.fetch(key, callback),
      deduplicator.fetch(key, callback),
    ])

    expect(requestCount).toBe(2)
    expect(secondBatch[0]).toBe("result-2")
    expect(secondBatch[1]).toBe("result-2")
  })

  it("should handle errors properly", async () => {
    const deduplicator = new RequestDeduplicator()
    const key = "error-key"

    const failingCallback = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50))
      throw new Error("Request failed")
    }

    // Запускаем несколько запросов с ошибкой
    const promises = [
      deduplicator.fetch(key, failingCallback).catch((e) => e),
      deduplicator.fetch(key, failingCallback).catch((e) => e),
      deduplicator.fetch(key, failingCallback).catch((e) => e),
    ]

    const results = await Promise.all(promises)

    // Все промисы должны получить одинаковую ошибку
    expect(results[0]).toBeInstanceOf(Error)
    expect(results[0].message).toBe("Request failed")
    expect(results[1].message).toBe("Request failed")
    expect(results[2].message).toBe("Request failed")

    // Убедимся что это тот же объект ошибки
    expect(results[0]).toBe(results[1])
    expect(results[1]).toBe(results[2])
  })

  it("should work with async/await patterns", async () => {
    const deduplicator = new RequestDeduplicator()
    let executionCount = 0

    const apiCall = async (id: number) => {
      executionCount++
      await new Promise((resolve) => setTimeout(resolve, 100))
      return { id, timestamp: Date.now() }
    }

    // Симуляция реального использования
    async function getUserData(userId: string) {
      return deduplicator.fetch(`user-${userId}`, () =>
        apiCall(parseInt(userId)),
      )
    }

    // В разных частях приложения запрашиваем одни и те же данные
    const [user1a, user1b, user2a, user1c] = await Promise.all([
      getUserData("1"),
      getUserData("1"),
      getUserData("2"),
      getUserData("1"),
    ])

    // Должно быть 2 реальных запроса: для user-1 и user-2
    expect(executionCount).toBe(2)

    // Все запросы user-1 должны вернуть одинаковые данные
    expect(user1a).toEqual(user1b)
    expect(user1b).toEqual(user1c)

    // user-2 должен быть другим
    expect(user2a.id).toBe(2)
  })

  it("should release mutex even if callback throws", async () => {
    const deduplicator = new RequestDeduplicator()
    const key = "failing-key"
    let callCount = 0

    const unstableCallback = async () => {
      callCount++
      await new Promise((resolve) => setTimeout(resolve, 50))
      if (callCount === 1) {
        throw new Error("First attempt failed")
      }
      return "success"
    }

    // Первый вызов должен упасть с ошибкой
    try {
      await deduplicator.fetch(key, unstableCallback)
    } catch (error) {
      expect((error as any).message).toBe("First attempt failed")
    }

    // Даем время на очистку
    await new Promise((resolve) => setTimeout(resolve, 10))

    // Второй вызов должен работать (должен освободиться мьютекс)
    const result = await deduplicator.fetch(key, unstableCallback)
    expect(result).toBe("success")
    expect(callCount).toBe(2)
  })

  it("should handle concurrent requests to different keys", async () => {
    const deduplicator = new RequestDeduplicator()
    const results: string[] = []
    const order: string[] = []

    const callback = (id: string) => async () => {
      order.push(`start-${id}`)
      await new Promise((resolve) => setTimeout(resolve, Math.random() * 50))
      order.push(`end-${id}`)
      return `result-${id}`
    }

    // Запускаем много запросов с разными ключами
    const promises = []
    for (let i = 0; i < 10; i++) {
      const key = `key-${i % 3}` // 3 уникальных ключа
      promises.push(
        deduplicator.fetch(key, callback(key)).then((res) => results.push(res)),
      )
    }

    await Promise.all(promises)

    // Должно быть 3 уникальных результата
    const uniqueResults = new Set(results)
    expect(uniqueResults.size).toBe(3)

    // Должны быть результаты для всех ключей
    expect(results).toContain("result-key-0")
    expect(results).toContain("result-key-1")
    expect(results).toContain("result-key-2")
  })
})
