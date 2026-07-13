import { truncate } from "../src"
test("truncate", () => { expect(truncate("Hello world", 8)).toBe("Hello..."); expect(truncate("Hello", 3)).toBe("...") })
