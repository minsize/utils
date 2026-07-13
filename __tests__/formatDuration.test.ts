import { formatDuration } from "../src"
test("formatDuration", () => { expect(formatDuration(90_000)).toBe("1m 30s"); expect(formatDuration(0)).toBe("0ms") })
