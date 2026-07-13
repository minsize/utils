import { toKebabCase } from "../src"
test("toKebabCase", () => expect(toKebabCase("userProfile name")).toBe("user-profile-name"))
