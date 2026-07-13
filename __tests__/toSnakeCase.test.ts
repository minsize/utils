import { toSnakeCase } from "../src"
test("toSnakeCase", () => expect(toSnakeCase("userProfile name")).toBe("user_profile_name"))
