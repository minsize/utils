import { toCamelCase } from "../src"
test("toCamelCase", () => expect(toCamelCase("user-profile name")).toBe("userProfileName"))
