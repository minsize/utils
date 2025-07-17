import comparison from "./comparison"

/**
 * Функция для обновления текущих значений
 * Принимает текущие значения и возвращает новые
 */
type UpdaterFunction<T extends any[]> = (...current: Partial<T>) => T

/**
 * Объект для частичного обновления значений
 * Каждый ключ соответствует частичному обновлению элемента массива
 */
type PartialUpdateObject<T extends any[]> = {
  [K in keyof T]?: T[K] extends object ? Partial<T[K]> : T[K]
}

type Options<T extends any[]> = {
  delay: number
  equals?: (prev: T, next: T) => boolean
}

/**
 * Класс для отложенного выполнения функции с возможностью
 * накопления и обновления аргументов
 */
class DebouncedFunction<T extends any[]> {
  private readonly cb: (...args: T) => void
  private readonly o: Options<T>
  private tId: NodeJS.Timeout | null = null
  private s: T
  private c: T

  constructor(callback: (...args: T) => void, options: Options<T>) {
    this.cb = callback
    this.o = options
    this.s = [] as unknown as T // Инициализация пустым массивом
    this.c = [] as unknown as T // Инициализация пустым массивом (Самые первые значения)
  }

  /**
   * Обновляет текущие аргументы с помощью функции обновления
   * @param updater Функция, которая получает текущие значения и возвращает новые
   */
  execute(fn: UpdaterFunction<T>): void
  /**
   * Полностью заменяет текущие аргументы новыми значениями
   * @param args Новые значения аргументов
   */
  execute(...args: PartialUpdateObject<T>): void

  execute(...args: [UpdaterFunction<T>] | PartialUpdateObject<T>): void {
    this.cancel()

    if (Object.prototype.toString.call(args[0]) === "[object Function]") {
      this.s = (args[0] as any)(...this.s)
    } else {
      for (let i = 0; i < this.cb.length; i++) {
        this.s[i] = args[i] as T[number]
      }
    }

    this.tId = setTimeout(this.executeImmediately.bind(this), this.o.delay)
  }

  /**
   * Немедленно выполняет функцию с текущими аргументами
   * и сбрасывает сохраненные аргументы
   */
  executeImmediately(): void {
    this.cancel()

    var equals = this.o.equals?.(this.c, this.s)

    if (equals === undefined) {
      for (let i = 0; i < this.cb.length; i++) {
        equals = comparison(this.c[i], this.s[i])
        if (!equals) {
          continue
        }
      }
    }

    if (!equals) {
      this.cb(...this.s)
    }

    this.s = [] as unknown as T
  }

  /**
   * Отменяет запланированное выполнение функции
   */
  cancel(): void {
    if (this.tId) {
      clearTimeout(this.tId)
      this.tId = null
    }
  }
}

export default DebouncedFunction

const test = new DebouncedFunction((value1: string, value2: number) => {}, {
  delay: 1,
  equals: ([prevvalue1, prevvalue2], [value1, value2]) => {
    return false
  },
})
