import comparison from "./comparison"
import getChangedData from "./getChangedData"
import unlink from "./unlink"

class DataKeeper<VALUE extends unknown> {
  initValue: VALUE
  currentValue: VALUE

  constructor(value: VALUE) {
    this.initValue = unlink(value)
    this.currentValue = value
  }

  setter(updater: (value: VALUE) => VALUE) {
    this.currentValue = updater(this.currentValue)
  }

  reset(value: VALUE) {
    this.initValue = unlink(value)
    this.currentValue = value
  }

  isModified() {
    return !comparison(this.initValue, this.currentValue)
  }

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
