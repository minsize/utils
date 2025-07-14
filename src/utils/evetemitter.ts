// Тип для callback-функций
type Callback<T extends unknown[] = unknown[]> = (...args: T) => void

class EventEmitter<TEvents extends Record<string, unknown[]>> {
  // Хранилище событий и их обработчиков
  e: Record<string, Callback[]> = {}

  /**
   * Подписка на событие
   * @param name - Имя события
   * @param callback - Функция-обработчик
   * @returns Функция для отписки
   */
  on<TEventName extends keyof TEvents & string>(
    name: TEventName,
    callback: Callback<TEvents[TEventName]>,
  ): () => void {
    if (!this.e[name]) {
      this.e[name] = []
    }

    // Приводим тип callback к более общему Callback<unknown[]>
    this.e[name].push(callback as Callback)

    return () => this.off(name, callback)
  }

  /**
   * Отписка от события
   * @param name - Имя события
   * @param callback - Функция-обработчик для удаления
   */
  off<TEventName extends keyof TEvents & string>(
    name: TEventName,
    callback: Callback<TEvents[TEventName]>,
  ): void {
    if (!this.e[name]) return

    const index = this.e[name].findIndex((cb) => cb === callback)
    if (index !== -1) {
      this.e[name].splice(index, 1)

      if (this.e[name].length === 0) {
        delete this.e[name]
      }
    }
  }

  /**
   * Инициация события
   * @param name - Имя события
   * @param args - Аргументы для обработчиков
   */
  emit<TEventName extends keyof TEvents & string>(
    name: TEventName,
    ...args: TEvents[TEventName]
  ): void {
    if (!this.e[name]) return

    const callbacks = this.e[name].slice()

    for (const callback of callbacks) {
      try {
        // Приводим тип callback обратно к нужному типу
        ;(callback as Callback<TEvents[TEventName]>)(...args)
      } catch (error) {
        console.error(`Ошибка в обработчике события ${name}:`, error)
      }
    }
  }

  /**
   * Подписка на событие один раз
   * @param name - Имя события
   * @param callback - Функция-обработчик
   * @returns Функция для отписки
   */
  once<TEventName extends keyof TEvents & string>(
    name: TEventName,
    callback: Callback<TEvents[TEventName]>,
  ): () => void {
    const onceWrapper = (...args: TEvents[TEventName]) => {
      this.off(name, onceWrapper as Callback<TEvents[TEventName]>)
      callback(...args)
    }
    return this.on(name, onceWrapper)
  }

  /**
   * Полная очистка всех подписчиков
   * @param name - Опциональное имя события (если не указано - очищаем все)
   */
  clear<TEventName extends keyof TEvents & string>(name?: TEventName): void {
    if (name) {
      delete this.e[name]
    } else {
      this.e = {}
    }
  }
}

export default EventEmitter
