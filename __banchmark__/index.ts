import Benchmark from "benchmark"
import { comparison, DebouncedFunction, isType, updateCurrent } from "../src"

var suite = new Benchmark.Suite()

const debounced = new DebouncedFunction((value: { id: 1 }) => {}, {
  delay: 1_000,
})

suite
  .add("isType", function () {
    isType({})
  })
  .add("updateCurrent", function () {
    const currentState = {
      a: 1,
      b: 2,
      test: { id: 1, array: [1, 2, 3] },
      c: undefined,
    }
    const nextState = { b: 3, c: 4, test: { id: 2, a: 2, array: [1, 2, 3, 4] } }

    updateCurrent(currentState, nextState)
  })
  .add("comparison", function () {
    comparison({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })
  })
  .add("DebouncedFunction", function () {
    debounced.execute({ id: 1 })
  })
  // add listeners
  .on("cycle", function (event: any) {
    console.log(String(event.target))
  })
  // run async
  .run({ async: true })
