// Типы для TypeScript
export interface UrlRule {
  hosts: string[]
  paths?: (string | RegExp)[] // Объединяем paths и pathPatterns в один массив
  hash?: (string | RegExp)[] // Объединяем hash и hashPatterns в один массив
  allowedParams?: string[]
  ignoreParams?: string[]
  priority?: number
  action?: UrlAction
  id?: string
}

export const enum UrlAction {
  ALLOW = 1,
  DENY = 2,
}

/**
 * Менеджер безопасности URL
 * Обеспечивает проверку и контроль доступа к URL на основе настроенных правил
 *
 * @example
 * const securityManager = new UrlSecurityManager(ALLOWED_URLS);
 * if (securityManager.isAllowed(someUrl)) {
 *   openUrl(someUrl);
 * } else {
 *   showWarningModal(someUrl);
 * }
 */
class UrlSecurityManager {
  private rules: UrlRule[]
  private cache: Map<string, boolean>
  private cacheEnabled: boolean

  /**
   * Создает экземпляр менеджера безопасности URL
   *
   * @param rules - Массив правил для проверки URL
   * @param enableCache - Включить кеширование результатов проверки для производительности
   */
  constructor(rules: UrlRule[] = [], enableCache: boolean = true) {
    // Сортируем правила по приоритету (от высшего к низшему) для правильной очередности проверки
    this.rules = [...rules].sort(
      (a, b) => (a.priority || 50) - (b.priority || 50),
    )
    this.cache = new Map()
    this.cacheEnabled = enableCache
    this.validateConfig()
  }

  /**
   * Проверяет, разрешен ли доступ к указанному URL
   *
   * @param inputUrl - URL для проверки (строка или объект URL)
   * @returns true если доступ разрешен, false если запрещен
   *
   * @example
   * securityManager.isAllowed('https://example.com') // true/false
   * securityManager.isAllowed(new URL('https://example.com')) // true/false
   */
  public isAllowed(inputUrl: string | URL): boolean {
    try {
      const url = typeof inputUrl === "string" ? new URL(inputUrl) : inputUrl

      // Защита от обфусцированных и потенциально опасных URL
      if (this.isObfuscatedUrl(url)) {
        return false
      }

      const cacheKey = this.getCacheKey(url)

      // Используем кеш для увеличения производительности при повторных проверках
      if (this.cacheEnabled && this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey)!
      }

      const result = this.evaluateRules(url)

      if (this.cacheEnabled) {
        this.cache.set(cacheKey, result)
      }

      this.logAccess(url, result)
      return result
    } catch (error) {
      // В случае невалидного URL всегда запрещаем доступ
      console.error("Invalid URL:", inputUrl, error)
      return false
    }
  }

  /**
   * Оценивает URL по всем правилам в порядке приоритета
   * Первое совпавшее правило определяет результат
   *
   * @param url - URL объект для проверки
   * @returns Результат проверки доступа
   */
  private evaluateRules(url: URL): boolean {
    let finalDecision: boolean | null = null
    let matchedRuleId: string | null = null

    // Проходим по всем правилам от высшего приоритета к низшему
    for (const rule of this.rules) {
      if (this.ruleMatches(url, rule)) {
        // Запоминаем первое совпавшее правило (с наивысшим приоритетом)
        if (finalDecision === null) {
          finalDecision = rule.action === UrlAction.ALLOW
          matchedRuleId = rule.id || null
        }

        // Логируем все совпавшие правила для отладки
        console.debug(`Rule "${rule.id}" matched for ${url.href}`)
      }
    }

    // Если ни одно правило не совпало - запрещаем по умолчанию (secure by default)
    if (finalDecision === null) {
      console.warn(`No rules matched for ${url.href}, defaulting to deny`)
      return false
    }

    console.debug(
      `Final decision for ${url.href}: ${finalDecision} (rule: ${matchedRuleId})`,
    )
    return finalDecision
  }

  /**
   * Проверяет соответствие URL конкретному правилу
   *
   * @param url - URL для проверки
   * @param rule - Правило для проверки
   * @returns true если URL соответствует правилу
   */
  private ruleMatches(url: URL, rule: UrlRule): boolean {
    // Последовательно проверяем все компоненты правила
    return (
      this.checkHost(rule, url) &&
      this.checkPaths(rule, url) &&
      this.checkHash(rule, url) &&
      this.checkParams(rule, url)
    )
  }

  /**
   * Проверяет соответствие хоста URL правилу
   *
   * @param rule - Правило для проверки
   * @param url - URL для проверки
   * @returns true если хост соответствует
   */
  private checkHost(rule: UrlRule, url: URL): boolean {
    // Специальный случай - правило для всех доменов
    if (rule.hosts.includes("*")) {
      return true
    }

    // Проверяем точное соответствие или поддомены
    return rule.hosts.some(
      (host) => url.host === host || url.host.endsWith("." + host),
    )
  }

  /**
   * Проверяет соответствие пути URL правилу
   * Поддерживает как строки, так и регулярные выражения
   *
   * @param rule - Правило для проверки
   * @param url - URL для проверки
   * @returns true если путь соответствует
   */
  private checkPaths(rule: UrlRule, url: URL): boolean {
    // Если нет ограничений по путям - разрешаем
    if (!rule.paths || rule.paths.length === 0) {
      return true
    }

    // Проверяем все пути в правиле
    return rule.paths.some((path) => {
      if (typeof path === "string") {
        // Для строк проверяем точное соответствие или начало пути
        return url.pathname === path || url.pathname.startsWith(path + "/")
      } else {
        // Для регулярных выражений проверяем соответствие паттерну
        return path.test(url.pathname)
      }
    })
  }

  /**
   * Проверяет соответствие hash части URL правилу
   * Поддерживает как строки, так и регулярные выражения
   *
   * @param rule - Правило для проверки
   * @param url - URL для проверки
   * @returns true если hash соответствует
   */
  private checkHash(rule: UrlRule, url: URL): boolean {
    // Если нет ограничений по hash - разрешаем
    if (!rule.hash || rule.hash.length === 0) {
      return true
    }

    const urlHash = url.hash

    // Проверяем все hash в правиле
    return rule.hash.some((hash) => {
      if (typeof hash === "string") {
        // Для строк проверяем точное соответствие
        return urlHash === hash
      } else {
        // Для регулярных выражений проверяем соответствие паттерну
        return hash.test(urlHash)
      }
    })
  }

  /**
   * Проверяет параметры запроса URL на соответствие правилу
   *
   * @param rule - Правило для проверки
   * @param url - URL для проверки
   * @returns true если параметры соответствуют
   */
  private checkParams(rule: UrlRule, url: URL): boolean {
    // Если нет ограничений по параметрам - разрешаем
    if (!rule.allowedParams && !rule.ignoreParams) {
      return true
    }

    const testUrl = new URL(url.toString())

    // Удаляем игнорируемые параметры из проверки
    if (rule.ignoreParams) {
      rule.ignoreParams.forEach((param) => {
        testUrl.searchParams.delete(param)
      })
    }

    // Проверяем что все оставшиеся параметры разрешены
    if (rule.allowedParams && testUrl.searchParams.size > 0) {
      for (const [key] of testUrl.searchParams) {
        if (!rule.allowedParams.includes(key)) {
          return false
        }
      }
    }

    return true
  }

  /**
   * Обнаруживает обфусцированные и потенциально опасные URL
   *
   * @param url - URL для проверки
   * @returns true если URL считается обфусцированным
   */
  private isObfuscatedUrl(url: URL): boolean {
    const suspiciousPatterns = [
      /@/, // user@example.com в hostname - возможна обфускация
      /\\/, // обратные слеши - нестандартные для URL
      /^\d+\.\d+\.\d+\.\d+$/, // IP-адрес вместо домена
      /\[.*\]/, // IPv6 в квадратных скобках
      /localhost/, // localhost в продакшене
    ]

    return suspiciousPatterns.some(
      (pattern) => pattern.test(url.hostname) || pattern.test(url.href),
    )
  }

  /**
   * Создает ключ для кеширования на основе нормализованного URL
   *
   * @param url - URL для нормализации
   * @returns Ключ кеша
   */
  private getCacheKey(url: URL): string {
    const normalizedUrl = new URL(url.toString())
    normalizedUrl.searchParams.sort() // Сортируем параметры для консистентности

    return `${normalizedUrl.host}${normalizedUrl.pathname}${normalizedUrl.search}${normalizedUrl.hash}`
  }

  /**
   * Логирует результат проверки доступа
   *
   * @param url - Проверяемый URL
   * @param allowed - Результат проверки
   */
  private logAccess(url: URL, allowed: boolean): void {
    const level = allowed ? "info" : "warn"
    console[level](`URL ${allowed ? "allowed" : "blocked"}: ${url.href}`)
  }

  /**
   * Валидирует конфигурацию правил при инициализации
   * Выводит предупреждения в консоль при некорректных правилах
   */
  private validateConfig(): void {
    const errors: string[] = []

    this.rules.forEach((item: UrlRule, index: number) => {
      if (
        !item.hosts ||
        !Array.isArray(item.hosts) ||
        item.hosts.length === 0
      ) {
        errors.push(`Rule ${index}: missing or invalid 'hosts' array`)
      }

      // Проверяем, что приоритет в допустимом диапазоне
      if (
        item.priority !== undefined &&
        (item.priority < 1 || item.priority > 100)
      ) {
        errors.push(`Rule ${index}: priority must be between 1 and 100`)
      }

      // Проверяем допустимые значения action
      if (
        item.action &&
        ![UrlAction.ALLOW, UrlAction.DENY].includes(item.action)
      ) {
        errors.push(`Rule ${index}: action must be 'allow' or 'deny'`)
      }
    })

    if (errors.length > 0) {
      console.warn("URL security config validation errors:", errors)
    }
  }

  /**
   * Находит правило, которое применилось к указанному URL
   * Полезно для отображения пользователю причины блокировки
   *
   * @param inputUrl - URL для проверки
   * @returns Найденное правило или null если не найдено
   *
   * @example
   * const rule = securityManager.findMatchingRule(blockedUrl);
   * console.log(`Access blocked by: ${rule?.id}`);
   */
  public findMatchingRule(inputUrl: string | URL): UrlRule | null {
    try {
      const url = typeof inputUrl === "string" ? new URL(inputUrl) : inputUrl

      // Ищем первое совпавшее правило (с наивысшим приоритетом)
      for (const rule of this.rules) {
        if (this.ruleMatches(url, rule)) {
          return rule
        }
      }

      return null
    } catch (error) {
      return null
    }
  }

  /**
   * Очищает кеш проверок
   * Полезно при обновлении правил в runtime
   */
  public clearCache(): void {
    this.cache.clear()
  }

  /**
   * Включает или выключает кеширование
   *
   * @param enabled - Состояние кеширования
   */
  public setCacheEnabled(enabled: boolean): void {
    this.cacheEnabled = enabled
    if (!enabled) {
      this.clearCache()
    }
  }

  /**
   * Возвращает текущее количество закешированных результатов
   *
   * @returns Количество закешированных записей
   */
  public getCacheSize(): number {
    return this.cache.size
  }
}

export default UrlSecurityManager
