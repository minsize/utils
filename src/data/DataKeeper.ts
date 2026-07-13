import comparison from "./comparison"
import getChangedData from "./getChangedData"
import unlink from "./unlink"

/**
 * Хранит исходное и текущее значения, позволяя проверить и получить изменения.
 *
 * @example
 * const form = new DataKeeper({ name: "Ann" })
 * form.setter((value) => ({ ...value, name: "Bob" }))
 * form.updateValues // { name: "Bob" }
 */
class DataKeeper<VALUE extends unknown> {
  initValue: VALUE
  currentValue: VALUE

  /** Создаёт хранилище и сохраняет копию начального значения. */
  constructor(value: VALUE) {
    this.initValue = unlink(value)
    this.currentValue = value
  }

  /**
   * Заменяет текущее значение результатом функции обновления.
   *
   * @example
   * form.setter((value) => ({ ...value, name: "Bob" }))
   */
  setter(updater: (value: VALUE) => VALUE) {
    this.currentValue = updater(this.currentValue)
  }

  /**
   * Устанавливает новое исходное и текущее значение.
   *
   * @example
   * form.reset({ name: "Ann" })
   */
  reset(value: VALUE) {
    this.initValue = unlink(value)
    this.currentValue = value
  }

  /**
   * Проверяет, отличается ли текущее значение от исходного.
   *
   * @example
   * form.isModified() // true
   */
  isModified() {
    return !comparison(this.initValue, this.currentValue)
  }

  /**
   * Возвращает только изменившуюся часть текущего значения.
   *
   * @example
   * form.updateValues // { name: "Bob" }
   */
  get updateValues() {
    return getChangedData(this.initValue, this.currentValue)
  }
}

export default DataKeeper

// const test = new DataKeeper(() => ({id:1, value:2}))

// test.setter((value) => {

//   value.id = 12

//   return value
// })

// test.isModified()
