import { DebouncedFunction } from "../src"

describe("EventEmitter", () => {
  it("replace", async () => {
    const status = await new Promise((resolve) => {
      const debounced = new DebouncedFunction(
        (result: string) => {
          resolve(result === "3")
        },
        {
          delay: 100,
        },
      )

      debounced.execute("1")
      debounced.execute("2")
      debounced.execute("3")
    })
    expect(status).toEqual(true)
  })

  it("update", async () => {
    const status = await new Promise((resolve) => {
      const debounced = new DebouncedFunction(
        (result: { id?: number; name?: string }) => {
          resolve(result.id === 3 && result.name === "test")
        },

        {
          delay: 100,
        },
      )

      debounced.execute((value) => {
        if (!value) value = {}

        value.name = "test"

        return [value]
      })

      debounced.execute((value) => {
        if (!value) value = {}

        value.id = 3

        return [value]
      })
    })
    expect(status).toEqual(true)
  })

  it("executeImmediately", async () => {
    const startTime = new Date(Date.now())
    const status = await new Promise((resolve) => {
      const debounced = new DebouncedFunction(
        (result: { name?: string }) => {
          resolve(
            result.name === "test" && startTime.getTime() + 100 > Date.now(),
          )
        },
        {
          delay: 10_000,
        },
      )

      debounced.execute((value) => {
        if (!value) value = {}

        value.name = "test"

        return [value]
      })

      debounced.executeImmediately()
    })
    expect(status).toEqual(true)
  })

  it("timeout", async () => {
    const startTime = new Date(Date.now())
    const status = await new Promise((resolve) => {
      const debounced = new DebouncedFunction(
        (result: { name?: string }) => {
          resolve(
            result.name === "test" && startTime.getTime() + 3_200 > Date.now(),
          )
        },
        {
          delay: 2_000,
        },
      )

      debounced.execute((value) => {
        if (!value) value = {}

        value.name = "test2"

        return [value]
      })

      setTimeout(() => {
        debounced.execute((value) => {
          if (!value) value = {}

          value.name = "test"

          return [value]
        })
      }, 1_000)
    })
    expect(status).toEqual(true)
  })
})
