// Тип для callback-функций
type Callback<T extends unknown[] = unknown[]> = (...args: T) => void

// Тип для обертки once с флагом
interface OnceWrapper extends Callback {
  isOnce?: boolean
}

/**
 * Типизированный диспетчер событий с обычными, одноразовыми и отложенными событиями.
 *
 * @example
 * const events = new EventEmitter<{ ready: [id: string] }>()
 * events.on("ready", (id) => console.log(id))
 * events.emit("ready", "42")
 */
class EventEmitter<TEvents extends Record<string, unknown[]>> {
  // Хранилище событий и их обработчиков
  e: Record<string, Callback[]> = {}

  // Хранилище отложенных событий (если нет подписчиков)
  pendingEvents: Record<string, TEvents[keyof TEvents & string][]> = {}

  /**
   * Подписка на событие
   * @param name - Имя события
   * @param callback - Функция-обработчик
   * @returns Функция для отписки
   *
   * @example
   * const unsubscribe = events.on("ready", handler)
   */
  on<TEventName extends keyof TEvents & string>(
    name: TEventName,
    callback: Callback<TEvents[TEventName]>,
  ): () => void {
    if (!this.e[name]) {
      this.e[name] = []
    }

    this.e[name].push(callback as Callback)

    // Если есть отложенные события для этого имени - отправляем их новому подписчику
    if (this.pendingEvents[name] && this.pendingEvents[name].length > 0) {
      // Создаем копию буфера, так как он может измениться во время отправки
      const pending = [...this.pendingEvents[name]]

      // Не очищаем буфер сразу! Очистим только после отправки всех событий,
      // но если подписчик отписался (once), то нужно сохранить оставшиеся

      let shouldContinue = true

      for (let i = 0; i < pending.length && shouldContinue; i++) {
        const args = pending[i]

        // Проверяем, не отписался ли уже подписчик
        if (!this.e[name]?.includes(callback as Callback)) {
          // Подписчик отписался, сохраняем оставшиеся события в буфер
          const remainingEvents = pending.slice(i)
          if (remainingEvents.length > 0) {
            this.pendingEvents[name] = remainingEvents
          } else {
            delete this.pendingEvents[name]
          }
          shouldContinue = false
          break
        }

        try {
          callback(...(args as TEvents[TEventName]))
        } catch (error) {
          console.error(`Ошибка в обработчике события ${name}:`, error)
        }

        // Если это onceWrapper, проверяем, отписался ли он после вызова
        if ((callback as OnceWrapper).isOnce) {
          // onceWrapper отписывается после первого вызова
          if (!this.e[name]?.includes(callback as Callback)) {
            // Подписчик отписался, сохраняем оставшиеся события
            const remainingEvents = pending.slice(i + 1)
            if (remainingEvents.length > 0) {
              this.pendingEvents[name] = remainingEvents
            } else {
              delete this.pendingEvents[name]
            }
            shouldContinue = false
            break
          }
        }
      }

      // Если все события были отправлены и подписчик все еще подписан, очищаем буфер
      if (shouldContinue && this.e[name]?.includes(callback as Callback)) {
        delete this.pendingEvents[name]
      }
    }

    return () => this.off(name, callback)
  }

  /**
   * Отписка от события
   * @param name - Имя события
   * @param callback - Функция-обработчик для удаления
   *
   * @example
   * events.off("ready", handler)
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
   * Инициация события (без отложенной отправки)
   * @param name - Имя события
   * @param args - Аргументы для обработчиков
   *
   * @example
   * events.emit("ready", "42")
   */
  emit<TEventName extends keyof TEvents & string>(
    name: TEventName,
    ...args: TEvents[TEventName]
  ): void {
    if (!this.e[name] || this.e[name].length === 0) {
      console.log(
        `[EventEmitter] Нет подписчиков на "${name}", событие проигнорировано`,
      )
      return
    }

    const callbacks = this.e[name].slice()

    for (const callback of callbacks) {
      try {
        ;(callback as Callback<TEvents[TEventName]>)(...args)
      } catch (error) {
        console.error(`Ошибка в обработчике события ${name}:`, error)
      }
    }
  }

  /**
   * Инициация события с отложенной отправкой (если нет подписчиков - сохраняет в буфер)
   * @param name - Имя события
   * @param args - Аргументы для обработчиков
   *
   * @example
   * events.emitWithDefer("ready", "42")
   */
  emitWithDefer<TEventName extends keyof TEvents & string>(
    name: TEventName,
    ...args: TEvents[TEventName]
  ): void {
    if (this.e[name] && this.e[name].length > 0) {
      const callbacks = this.e[name].slice()

      for (const callback of callbacks) {
        try {
          ;(callback as Callback<TEvents[TEventName]>)(...args)
        } catch (error) {
          console.error(`Ошибка в обработчике события ${name}:`, error)
        }
      }
      return
    }

    console.log(
      `[EventEmitter] Нет подписчиков на "${name}", сохраняем событие в буфер`,
    )

    if (!this.pendingEvents[name]) {
      this.pendingEvents[name] = []
    }

    this.pendingEvents[name].push(args)
  }

  /**
   * Подписка на событие один раз
   * @param name - Имя события
   * @param callback - Функция-обработчик
   * @returns Функция для отписки
   *
   * @example
   * events.once("ready", handler)
   */
  once<TEventName extends keyof TEvents & string>(
    name: TEventName,
    callback: Callback<TEvents[TEventName]>,
  ): () => void {
    // Создаем обертку с флагом once
    const onceWrapper = ((...args: TEvents[TEventName]) => {
      this.off(name, onceWrapper)
      callback(...args)
    }) as OnceWrapper

    onceWrapper.isOnce = true

    return this.on(name, onceWrapper)
  }

  /**
   * Полная очистка всех подписчиков
   * @param name - Опциональное имя события (если не указано - очищаем все)
   *
   * @example
   * events.clear("ready")
   */
  clear<TEventName extends keyof TEvents & string>(name?: TEventName): void {
    if (name) {
      delete this.e[name]
      delete this.pendingEvents[name]
    } else {
      this.e = {}
      this.pendingEvents = {}
    }
  }
}

export default EventEmitter
