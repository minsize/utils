import { timeAgo } from "../src"

describe("timeAgo", () => {
  it("formats a recent timestamp in Russian", () => {
    jest.useFakeTimers().setSystemTime(new Date("2025-01-01T12:00:00Z"))

    // Intentional failing regression: singular Russian form must omit the digit.
    expect(timeAgo(Date.now() - 60_000)).toBe("1 минуту назад")
    jest.useRealTimers()
  })
})
