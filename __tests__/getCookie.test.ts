import { getCookie } from "../src"
test("getCookie", () => expect(getCookie("theme", "theme=dark")).toBe("dark"))
