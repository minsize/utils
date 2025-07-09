// Тип для callback-функций
type Callback = (...args: unknown[]) => unknown

class EventEmitter {
  // Хранилище событий и их обработчиков
  e: Record<string, Callback[]> = {}

  // constructor() {
  //   this.e = {}
  // }

  /**
   * Подписка на событие
   * @param name - Имя события
   * @param callback - Функция-обработчик
   * @returns Функция для отписки
   */
  on(name: string, callback: Callback): () => void {
    // Исправлена ошибка в условии (было if(this.events[name]), теперь проверка на отсутствие
    if (!this.e[name]) {
      this.e[name] = []
    }

    this.e[name].push(callback)

    // Возвращаем функцию для удобной отписки
    return () => this.off(name, callback)
  }

  /**
   * Отписка от события
   * @param name - Имя события
   * @param callback - Функция-обработчик для удаления
   */
  off(name: string, callback: Callback): void {
    if (!this.e[name]) return

    let index = this.e[name].indexOf(callback)
    if (index !== -1) {
      this.e[name].splice(index, 1)

      // Удаляем пустой массив обработчиков для оптимизации памяти
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
  emit(name: string, ...args: unknown[]): void {
    if (!this.e[name]) return

    // Создаем копию массива обработчиков на случай,
    // если они будут изменены во время выполнения
    let callbacks = this.e[name].slice()

    // Используем for вместо forEach для потенциальной оптимизации
    for (let callback of callbacks) {
      try {
        callback(...args)
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
  once(name: string, callback: Callback): () => void {
    let onceWrapper = (...args: unknown[]) => {
      // Удаляем обертку, а не оригинальный callback
      this.off(name, onceWrapper)
      callback(...args)
    }
    return this.on(name, onceWrapper)
  }
  /**
   * Полная очистка всех подписчиков
   * @param name - Опциональное имя события (если не указано - очищаем все)
   */
  clear(name?: string): void {
    if (name) {
      delete this.e[name]
    } else {
      this.e = {}
    }
  }
}

export default EventEmitter
