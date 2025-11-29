import { UrlSecurityManager, UrlRule, UrlAction } from "../src"

describe("UrlSecurityManager", () => {
  let securityManager: UrlSecurityManager

  describe("Поддержка регулярных выражений в hosts", () => {
    it("должен разрешать доступ для хостов соответствующих регулярным выражениям", () => {
      const manager = new UrlSecurityManager([
        {
          id: "regexp-hosts",
          hosts: [/^api\.\w+\.com$/, /^staging\.example\.(com|net)$/],
          action: UrlAction.ALLOW,
          priority: 10,
        },
      ])

      expect(manager.isAllowed("https://api.service.com")).toBe(true)
      expect(manager.isAllowed("https://api.test.com")).toBe(true)
      expect(manager.isAllowed("https://staging.example.com")).toBe(true)
      expect(manager.isAllowed("https://staging.example.net")).toBe(true)
    })

    it("должен запрещать доступ для хостов не соответствующих регулярным выражениям", () => {
      const manager = new UrlSecurityManager([
        {
          id: "regexp-hosts-strict",
          hosts: [/^app\.example\.com$/],
          action: UrlAction.ALLOW,
          priority: 10,
        },
      ])

      expect(manager.isAllowed("https://app.example.com")).toBe(true)
      expect(manager.isAllowed("https://sub.app.example.com")).toBe(false)
      expect(manager.isAllowed("https://app-example.com")).toBe(false)
    })

    it("должен корректно работать с комбинацией строк и регулярных выражений", () => {
      const manager = new UrlSecurityManager([
        {
          id: "mixed-hosts",
          hosts: ["exact.com", /^sub\.\w+\.com$/, /^api-\d+\.org$/],
          action: UrlAction.ALLOW,
          priority: 10,
        },
      ])

      expect(manager.isAllowed("https://exact.com")).toBe(true)
      expect(manager.isAllowed("https://sub.test.com")).toBe(true)
      expect(manager.isAllowed("https://sub.demo.com")).toBe(true)
      expect(manager.isAllowed("https://api-123.org")).toBe(true)
      expect(manager.isAllowed("https://other.com")).toBe(false)
      expect(manager.isAllowed("https://sub.com")).toBe(false)
    })

    it("должен приоритизировать правила с регулярными выражениями в hosts", () => {
      const manager = new UrlSecurityManager([
        {
          id: "deny-regexp",
          hosts: [/^admin\.\w+\.com$/],
          action: UrlAction.DENY,
          priority: 1,
        },
        {
          id: "allow-specific",
          hosts: ["admin.trusted.com"],
          action: UrlAction.ALLOW,
          priority: 10,
        },
      ])

      expect(manager.isAllowed("https://admin.trusted.com")).toBe(false)
      expect(manager.isAllowed("https://admin.other.com")).toBe(false)
    })

    it("должен корректно обрабатывать сложные регулярные выражения", () => {
      const manager = new UrlSecurityManager([
        {
          id: "complex-regexp",
          hosts: [
            /^(www|api|cdn)\.example\.(com|org|net)$/,
            /^[a-z]+-\d+\.service\.com$/,
          ],
          action: UrlAction.ALLOW,
          priority: 10,
        },
      ])

      expect(manager.isAllowed("https://www.example.com")).toBe(true)
      expect(manager.isAllowed("https://api.example.org")).toBe(true)
      expect(manager.isAllowed("https://cdn.example.net")).toBe(true)
      expect(manager.isAllowed("https://test-123.service.com")).toBe(true)
      expect(manager.isAllowed("https://prod-456.service.com")).toBe(true)
      expect(manager.isAllowed("https://sub.example.com")).toBe(false)
      expect(manager.isAllowed("https://test.service.com")).toBe(false)
    })
  })

  describe("Базовая функциональность", () => {
    beforeEach(() => {
      securityManager = new UrlSecurityManager([
        {
          id: "allow-vk",
          hosts: ["vk.com"],
          paths: ["/anonim_messenger", "/elum.team"],
          action: UrlAction.ALLOW,
          priority: 10,
        },
        {
          id: "allow-telegram",
          hosts: ["t.me"],
          paths: ["/anonmsgr", "/anonmsgr_bot"],
          action: UrlAction.ALLOW,
          priority: 10,
        },
        {
          id: "deny-malicious",
          hosts: ["malicious.com"],
          action: UrlAction.DENY,
          priority: 1,
        },
      ])
    })

    it("должен разрешать доступ для разрешенных URL", () => {
      expect(securityManager.isAllowed("https://vk.com/anonim_messenger")).toBe(
        true,
      )
      expect(securityManager.isAllowed("https://t.me/anonmsgr")).toBe(true)
    })

    it("должен запрещать доступ для запрещенных URL", () => {
      expect(
        securityManager.isAllowed("https://m.vk.com/anonim_messenger"),
      ).toBe(false)
      expect(securityManager.isAllowed("https://malicious.com")).toBe(false)
      expect(securityManager.isAllowed("https://unknown.com")).toBe(false)
    })

    it("должен запрещать доступ для несоответствующих путей", () => {
      expect(securityManager.isAllowed("https://vk.com/other")).toBe(false)
      expect(securityManager.isAllowed("https://t.me/other_bot")).toBe(false)
    })
  })

  describe("Приоритет правил", () => {
    it("должен применять правила с высшим приоритетом первыми", () => {
      const manager = new UrlSecurityManager([
        {
          id: "allow-all",
          hosts: ["*"],
          action: UrlAction.ALLOW,
          priority: 100,
        },
        {
          id: "deny-specific",
          hosts: ["example.com"],
          action: UrlAction.DENY,
          priority: 1,
        },
      ])

      expect(manager.isAllowed("https://example.com")).toBe(false)
    })

    it("должен разрешать доступ если правило разрешения имеет высший приоритет", () => {
      const manager = new UrlSecurityManager([
        {
          id: "deny-all",
          hosts: ["*"],
          action: UrlAction.DENY,
          priority: 100,
        },
        {
          id: "allow-specific",
          hosts: ["trusted.com"],
          action: UrlAction.ALLOW,
          priority: 1,
        },
      ])

      expect(manager.isAllowed("https://trusted.com")).toBe(true)
    })
  })

  describe("Поддержка регулярных выражений в paths", () => {
    beforeEach(() => {
      securityManager = new UrlSecurityManager([
        {
          id: "api-rules",
          hosts: ["api.example.com"],
          paths: ["/v1/users", /^\/v\d+\/posts\/\d+$/, /^\/admin\/.*/],
          action: UrlAction.ALLOW,
          priority: 10,
        },
      ])
    })

    it("должен разрешать доступ для точных путей", () => {
      expect(
        securityManager.isAllowed("https://api.example.com/v1/users"),
      ).toBe(true)
    })

    it("должен разрешать доступ для путей соответствующих регулярным выражениям", () => {
      expect(
        securityManager.isAllowed("https://api.example.com/v1/posts/123"),
      ).toBe(true)
      expect(
        securityManager.isAllowed("https://api.example.com/v2/posts/456"),
      ).toBe(true)
      expect(
        securityManager.isAllowed("https://api.example.com/admin/dashboard"),
      ).toBe(true)
    })

    it("должен запрещать доступ для путей не соответствующих регулярным выражениям", () => {
      expect(
        securityManager.isAllowed("https://api.example.com/v1/comments"),
      ).toBe(false)
      expect(
        securityManager.isAllowed("https://api.example.com/posts/123"),
      ).toBe(false)
    })
  })

  describe("Поддержка hash", () => {
    beforeEach(() => {
      securityManager = new UrlSecurityManager([
        {
          id: "hash-rules",
          hosts: ["app.example.com"],
          paths: ["/page"],
          hash: ["#section1", /^#tab_\d+$/, /^#modal_.+$/],
          action: UrlAction.ALLOW,
          priority: 10,
        },
      ])
    })

    it("должен разрешать доступ для точных hash значений", () => {
      expect(
        securityManager.isAllowed("https://app.example.com/page#section1"),
      ).toBe(true)
    })

    it("должен разрешать доступ для hash соответствующих регулярным выражениям", () => {
      expect(
        securityManager.isAllowed("https://app.example.com/page#tab_1"),
      ).toBe(true)
      expect(
        securityManager.isAllowed("https://app.example.com/page#tab_123"),
      ).toBe(true)
      expect(
        securityManager.isAllowed(
          "https://app.example.com/page#modal_settings",
        ),
      ).toBe(true)
    })

    it("должен запрещать доступ для hash не соответствующих правилам", () => {
      expect(
        securityManager.isAllowed("https://app.example.com/page#other"),
      ).toBe(false)
      expect(
        securityManager.isAllowed("https://app.example.com/page#tab_abc"),
      ).toBe(false)
    })
  })

  describe("Параметры запроса", () => {
    beforeEach(() => {
      securityManager = new UrlSecurityManager([
        {
          id: "params-rules",
          hosts: ["api.service.com"],
          allowedParams: ["token", "version"],
          ignoreParams: ["timestamp", "nonce"],
          action: UrlAction.ALLOW,
          priority: 10,
        },
      ])
    })

    it("должен разрешать доступ с разрешенными параметрами", () => {
      expect(
        securityManager.isAllowed(
          "https://api.service.com?token=abc&version=1",
        ),
      ).toBe(true)
    })

    it("должен игнорировать указанные параметры при проверке", () => {
      expect(
        securityManager.isAllowed(
          "https://api.service.com?token=abc&timestamp=123",
        ),
      ).toBe(true)
    })

    it("должен запрещать доступ с неразрешенными параметрами", () => {
      expect(
        securityManager.isAllowed("https://api.service.com?secret=key"),
      ).toBe(false)
    })
  })

  describe("Защита от обфусцированных URL", () => {
    beforeEach(() => {
      securityManager = new UrlSecurityManager([
        {
          id: "allow-all",
          hosts: ["*"],
          action: UrlAction.ALLOW,
          priority: 100,
        },
      ])
    })

    it("должен запрещать доступ для URL с IP-адресами", () => {
      expect(securityManager.isAllowed("https://192.168.1.1")).toBe(false)
      expect(securityManager.isAllowed("https://10.0.0.1")).toBe(false)
    })

    it("должен запрещать доступ для URL с localhost", () => {
      expect(securityManager.isAllowed("https://localhost")).toBe(false)
      expect(securityManager.isAllowed("https://localhost:8080")).toBe(false)
    })

    it("должен запрещать доступ для URL с обфускацией через @", () => {
      expect(securityManager.isAllowed("https://user@example.com")).toBe(false)
    })
  })

  describe("Кеширование", () => {
    beforeEach(() => {
      securityManager = new UrlSecurityManager([
        {
          id: "test-rule",
          hosts: ["test.com"],
          action: UrlAction.ALLOW,
          priority: 10,
        },
      ])
    })

    it("должен кешировать результаты проверки", () => {
      const url = "https://test.com"

      // Первый вызов
      const firstResult = securityManager.isAllowed(url)

      // Второй вызов должен использовать кеш
      const secondResult = securityManager.isAllowed(url)

      expect(firstResult).toBe(true)
      expect(secondResult).toBe(true)
      expect(securityManager.getCacheSize()).toBe(1)
    })

    it("должен очищать кеш при вызове clearCache", () => {
      securityManager.isAllowed("https://test.com")
      expect(securityManager.getCacheSize()).toBe(1)

      securityManager.clearCache()
      expect(securityManager.getCacheSize()).toBe(0)
    })

    it("должен отключать кеширование при setCacheEnabled(false)", () => {
      securityManager.setCacheEnabled(false)
      securityManager.isAllowed("https://test.com")
      expect(securityManager.getCacheSize()).toBe(0)
    })
  })

  describe("Поиск совпадающего правила", () => {
    beforeEach(() => {
      securityManager = new UrlSecurityManager([
        {
          id: "deny-high",
          hosts: ["blocked.com"],
          action: UrlAction.DENY,
          priority: 1,
        },
        {
          id: "allow-medium",
          hosts: ["allowed.com"],
          action: UrlAction.ALLOW,
          priority: 10,
        },
      ])
    })

    it("должен находить правило которое применилось к URL", () => {
      const rule = securityManager.findMatchingRule("https://blocked.com")
      expect(rule?.id).toBe("deny-high")
    })

    it("должен возвращать null если правило не найдено", () => {
      const rule = securityManager.findMatchingRule("https://unknown.com")
      expect(rule).toBeNull()
    })
  })

  describe("Комплексные сценарии", () => {
    it("должен корректно обрабатывать комбинацию paths и hash", () => {
      const manager = new UrlSecurityManager([
        {
          id: "complex-rule",
          hosts: ["app.com"],
          paths: ["/dashboard", /^\/user\/\d+$/],
          hash: ["#settings", /^#profile_\w+$/],
          action: UrlAction.ALLOW,
          priority: 10,
        },
      ])

      expect(manager.isAllowed("https://app.com/dashboard#settings")).toBe(true)
      expect(manager.isAllowed("https://app.com/user/123#profile_john")).toBe(
        true,
      )
      expect(manager.isAllowed("https://app.com/dashboard#other")).toBe(false)
      expect(manager.isAllowed("https://app.com/other#settings")).toBe(false)
    })

    it("должен корректно обрабатывать поддомены", () => {
      const manager = new UrlSecurityManager([
        {
          id: "subdomain-rule",
          hosts: ["api.example.com"],
          action: UrlAction.ALLOW,
          priority: 10,
        },
      ])

      expect(manager.isAllowed("https://api.example.com")).toBe(true)
      expect(manager.isAllowed("https://sub.api.example.com")).toBe(false)
      expect(manager.isAllowed("https://example.com")).toBe(false)
    })
  })

  describe("Валидация конфигурации", () => {
    it("должен выбрасывать предупреждение при некорректных правилах", () => {
      const consoleSpy = jest.spyOn(console, "warn")

      new UrlSecurityManager([
        {
          id: "invalid-priority",
          hosts: ["test.com"],
          priority: 150, // Некорректный приоритет
          action: UrlAction.ALLOW,
        } as UrlRule,
      ])

      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })

  describe("Граничные случаи", () => {
    beforeEach(() => {
      securityManager = new UrlSecurityManager([
        {
          id: "default-allow",
          hosts: ["*"],
          action: UrlAction.ALLOW,
          priority: 100,
        },
      ])
    })

    it("должен обрабатывать невалидные URL", () => {
      expect(securityManager.isAllowed("invalid-url")).toBe(false)
      expect(securityManager.isAllowed("")).toBe(false)
    })

    it("должен обрабатывать URL объекты", () => {
      const url = new URL("https://example.com")
      expect(securityManager.isAllowed(url)).toBe(true)
    })
  })
})
