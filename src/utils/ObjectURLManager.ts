class ObjectURLManager {
  private urls = new Map<
    string,
    {
      url: string
      ttl: number
      createdAt: Date
      updatedAt: Date
      timeoutId?: NodeJS.Timeout
    }
  >()

  /**
   * Создает URL и устанавливает время открытия
   * @param key - Уникальный ключ
   * @param obj - объект
   * @param ttl - Время жизни в миллисекундах после создания
   * @returns {string} - Созданный URL
   */
  public create(
    key: string,
    obj: Parameters<typeof URL.createObjectURL>["0"],
    ttl: number,
  ): string {
    const url = URL.createObjectURL(obj)

    const createdAt = new Date()

    this.urls.set(key, {
      url: url,
      ttl: ttl,
      createdAt: createdAt,
      updatedAt: createdAt,
    })

    return url
  }

  /**
   * Обновляет время последнего открытия URL
   * @param key - URL для обновления
   * @returns {boolean} - Успешно ли обновлено
   */
  public access(key: string): boolean {
    const metadata = this.urls.get(key)
    if (!metadata) {
      return false
    }

    metadata.updatedAt = new Date()

    if (metadata.timeoutId) {
      clearTimeout(metadata.timeoutId)
      metadata.timeoutId = setTimeout(() => {
        if (this.urls.has(key) && this.isExpired(key)) {
          this.revoke(key)
        }
      }, metadata.ttl)
    }

    return true
  }

  /**
   * Принудительно удаляет URL
   * @param key - Уникальный ключ
   * @returns {boolean}
   */
  public revoke(key: string): boolean {
    const metadata = this.urls.get(key)
    if (metadata) {
      if (metadata.timeoutId) {
        clearTimeout(metadata.timeoutId)
      }

      URL.revokeObjectURL(metadata.url)
      this.urls.delete(key)

      return true
    }
    return false
  }

  /**
   * Удаляет все истекшие URL
   * @returns {number} - Количество удаленных URL
   */
  public cleanup(): number {
    let expiredCount = 0

    for (const [key, metadata] of this.urls.entries()) {
      const expirationTime = metadata.updatedAt.getTime() + metadata.ttl

      if (Date.now() > expirationTime) {
        this.revoke(key)
        expiredCount++
      }
    }

    return expiredCount
  }

  /**
   * Создает URL с таймером автоматического удаления
   * @param key - Уникальный ключ
   * @param obj - объект
   * @param ttl - Время жизни в миллисекундах после создания
   * @returns {string} - Созданный URL
   */
  public createWithAutoRevoke(
    key: string,
    obj: Parameters<typeof URL.createObjectURL>["0"],
    ttl: number,
  ): string {
    const url = this.create(key, obj, ttl)

    const metadata = this.urls.get(key)
    if (metadata) {
      metadata.timeoutId = setTimeout(() => {
        if (this.urls.has(key) && this.isExpired(key)) {
          this.revoke(key)
        }
      }, metadata.ttl)
    }

    return url
  }

  /**
   * Проверяет, истек ли срок жизни URL
   * @param {string} url - URL для проверки
   * @returns {boolean} - Истек ли срок
   */
  public isExpired(key: string): boolean {
    const metadata = this.urls.get(key)
    if (!metadata) return true

    const expirationTime = metadata.updatedAt.getTime() + metadata.ttl
    return Date.now() > expirationTime
  }
}

export default ObjectURLManager
