import { parseTextTokens } from "../src"

describe("parseTextTokens", () => {
  describe("Базовые случаи", () => {
    it("должен возвращать raw токен для обычного текста", () => {
      const result = parseTextTokens("Простой текст")
      expect(result).toEqual([{ type: "raw", value: "Простой текст" }])
    })

    it("должен возвращать пустой массив для пустой строки", () => {
      const result = parseTextTokens("")
      expect(result).toEqual([])
    })

    it("должен обрабатывать строку только с пробелами", () => {
      const result = parseTextTokens("   ")
      expect(result).toEqual([{ type: "raw", value: "   " }])
    })
  })

  describe("URL парсинг", () => {
    it("должен распознавать URL с http протоколом", () => {
      const result = parseTextTokens("Посетите http://example.com сайт")
      expect(result).toEqual([
        { type: "raw", value: "Посетите " },
        { type: "url", value: "http://example.com" },
        { type: "raw", value: " сайт" },
      ])
    })

    it("должен распознавать URL с https протоколом", () => {
      const result = parseTextTokens("Безопасный https://secure.site.com")
      expect(result).toEqual([
        { type: "raw", value: "Безопасный " },
        { type: "url", value: "https://secure.site.com" },
      ])
    })

    it("должен распознавать URL без протокола", () => {
      const result = parseTextTokens("Сайт example.com работает")
      expect(result).toEqual([
        { type: "raw", value: "Сайт " },
        { type: "url", value: "example.com" },
        { type: "raw", value: " работает" },
      ])
    })

    it("должен распознавать URL с путями и параметрами", () => {
      const result = parseTextTokens(
        "Страница https://site.com/path?query=value",
      )
      expect(result).toEqual([
        { type: "raw", value: "Страница " },
        { type: "url", value: "https://site.com/path?query=value" },
      ])
    })

    it("должен распознавать несколько URL в одном тексте", () => {
      const result = parseTextTokens("Первый site1.com и второй site2.org")
      expect(result).toEqual([
        { type: "raw", value: "Первый " },
        { type: "url", value: "site1.com" },
        { type: "raw", value: " и второй " },
        { type: "url", value: "site2.org" },
      ])
    })

    it("должен требовать протокол при опции requireProtocol", () => {
      const result = parseTextTokens(
        "Без proto site.com и с proto http://site.com",
        {
          requireProtocol: true,
        },
      )
      expect(result).toEqual([
        { type: "raw", value: "Без proto site.com и с proto " },
        { type: "url", value: "http://site.com" },
      ])
    })
  })

  describe("Эмодзи парсинг", () => {
    it("должен распознавать простые эмодзи", () => {
      const result = parseTextTokens("Привет! 😊 Как дела?")
      expect(result).toEqual([
        { type: "raw", value: "Привет! " },
        { type: "emoji", value: "😊" },
        { type: "raw", value: " Как дела?" },
      ])
    })

    it("должен распознавать несколько эмодзи подряд", () => {
      const result = parseTextTokens("Настроение: 😂🎉❤️")
      expect(result).toEqual([
        { type: "raw", value: "Настроение: " },
        { type: "emoji", value: "😂" },
        { type: "emoji", value: "🎉" },
        { type: "emoji", value: "❤️" },
      ])
    })

    it("должен распознавать составные эмодзи", () => {
      const result = parseTextTokens("Семья: 👨‍👩‍👧‍👦 и флаг: 🇺🇸")
      expect(result).toEqual([
        { type: "raw", value: "Семья: " },
        { type: "emoji", value: "👨‍👩‍👧‍👦" },
        { type: "raw", value: " и флаг: " },
        { type: "emoji", value: "🇺🇸" },
      ])
    })

    it("должен распознавать эмодзи с модификаторами тона кожи", () => {
      const result = parseTextTokens("Тоны: 👍🏿 👍🏽 👍🏻")
      expect(result).toEqual([
        { type: "raw", value: "Тоны: " },
        { type: "emoji", value: "👍🏿" },
        { type: "raw", value: " " },
        { type: "emoji", value: "👍🏽" },
        { type: "raw", value: " " },
        { type: "emoji", value: "👍🏻" },
      ])
    })
  })

  describe("Комбинированный парсинг URL и эмодзи", () => {
    it("должен корректно обрабатывать URL и эмодзи вместе 2", () => {
      const result = parseTextTokens(
        `Отличный сайт
         😊 example.com
          и смайлик
          ❤️`,
      )
      expect(result).toEqual([
        {
          type: "raw",
          value: `Отличный сайт
         `,
        },
        { type: "emoji", value: "😊" },
        { type: "raw", value: " " },
        { type: "url", value: "example.com" },
        {
          type: "raw",
          value: `
          и смайлик
          `,
        },
        { type: "emoji", value: "❤️" },
      ])
    })
    it("должен корректно обрабатывать URL и эмодзи вместе", () => {
      const result = parseTextTokens(
        "Отличный сайт 😊 example.com и смайлик ❤️",
      )
      expect(result).toEqual([
        { type: "raw", value: "Отличный сайт " },
        { type: "emoji", value: "😊" },
        { type: "raw", value: " " },
        { type: "url", value: "example.com" },
        { type: "raw", value: " и смайлик " },
        { type: "emoji", value: "❤️" },
      ])
    })

    it("должен обрабатывать сложную комбинацию", () => {
      const result = parseTextTokens(
        "🎉 Новость! http://site.com/news 😃 Ура! 👏",
      )
      expect(result).toEqual([
        { type: "emoji", value: "🎉" },
        { type: "raw", value: " Новость! " },
        { type: "url", value: "http://site.com/news" },
        { type: "raw", value: " " },
        { type: "emoji", value: "😃" },
        { type: "raw", value: " Ура! " },
        { type: "emoji", value: "👏" },
      ])
    })
  })

  describe("Кастомные опции", () => {
    it("должен применять onToken callback", () => {
      const result = parseTextTokens("test.com 😊", {
        onToken: (token) => ({
          ...token,
          value: token.value.toUpperCase(),
        }),
      })
      expect(result).toEqual([
        { type: "url", value: "TEST.COM" },
        { type: "raw", value: " " },
        { type: "emoji", value: "😊" },
      ])
    })

    it("должен использовать кастомное regex", () => {
      const customRegex = /(test-pattern)/g
      const result = parseTextTokens("Найди test-pattern здесь", {
        regex: customRegex,
      })
      expect(result).toEqual([
        { type: "raw", value: "Найди " },
        { type: "url", value: "test-pattern" },
        { type: "raw", value: " здесь" },
      ])
    })

    it("должен комбинировать requireProtocol и onToken", () => {
      const result = parseTextTokens("http://safe.com и unsafe.com", {
        requireProtocol: true,
        onToken: (token) => ({
          ...token,
          value: `[${token.value}]`,
        }),
      })
      expect(result).toEqual([
        { type: "url", value: "[http://safe.com]" },
        { type: "raw", value: "[ и unsafe.com]" },
      ])
    })
  })

  describe("Граничные случаи", () => {
    it("должен обрабатывать текст с символами, похожими на URL", () => {
      const result = parseTextTokens("Версия 1.0.0 и цена $100.50")
      expect(result).toEqual([
        { type: "raw", value: "Версия 1.0.0 и цена $100.50" },
      ])
    })

    it("должен корректно обрабатывать эмодзи в начале и конце строки", () => {
      const result = parseTextTokens("🚀 Запуск! 🎯")
      expect(result).toEqual([
        { type: "emoji", value: "🚀" },
        { type: "raw", value: " Запуск! " },
        { type: "emoji", value: "🎯" },
      ])
    })

    it("должен обрабатывать URL сразу после эмодзи", () => {
      const result = parseTextTokens("Сайт👉example.com")
      expect(result).toEqual([
        { type: "raw", value: "Сайт" },
        { type: "emoji", value: "👉" },
        { type: "url", value: "example.com" },
      ])
    })

    it("должен обрабатывать очень длинные URL", () => {
      const longUrl =
        "https://very-long-domain-name-that-should-still-work-properly.com/path/to/resource?with=multiple&query=parameters"
      const result = parseTextTokens(`Ссылка ${longUrl} конец`)
      expect(result).toEqual([
        { type: "raw", value: "Ссылка " },
        { type: "url", value: longUrl },
        { type: "raw", value: " конец" },
      ])
    })
  })

  describe("Интернационализация", () => {
    it("должен распознавать кириллические домены", () => {
      const result = parseTextTokens("Сайт пример.рф работает")
      expect(result).toEqual([
        { type: "raw", value: "Сайт " },
        { type: "url", value: "пример.рф" },
        { type: "raw", value: " работает" },
      ])
    })

    it("должен работать с различными языками", () => {
      const result = parseTextTokens("English text with 😊 and site.com")
      expect(result).toEqual([
        { type: "raw", value: "English text with " },
        { type: "emoji", value: "😊" },
        { type: "raw", value: " and " },
        { type: "url", value: "site.com" },
      ])
    })

    it("должен обрабатывать смешанные языки", () => {
      const result = parseTextTokens(
        "Русский текст 中文汉字 😊 و عربي http://مثال.إختبار",
      )
      expect(result.length).toBeGreaterThan(0)
      // Проверяем что парсинг не падает на смешанных языках
    })
  })

  describe("Производительность и стабильность", () => {
    it("должен обрабатывать очень длинный текст", () => {
      const longText = "word ".repeat(1000) + "final.com " + "😊".repeat(100)
      const result = parseTextTokens(longText)

      // Проверяем что функция завершается и возвращает результат
      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBeGreaterThan(0)
    })

    it("должен корректно обрабатывать специальные символы", () => {
      const specialText =
        "Text with \n newlines \t tabs and \r carriage returns example.com 😀"
      const result = parseTextTokens(specialText)

      // Проверяем что парсинг не ломается на специальных символах
      expect(result.some((token) => token.type === "url")).toBe(true)
      expect(result.some((token) => token.type === "emoji")).toBe(true)
    })
  })
})
