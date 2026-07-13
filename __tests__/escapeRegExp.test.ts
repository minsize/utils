import { escapeRegExp } from "../src"
test("escapeRegExp", () => expect(new RegExp(escapeRegExp("a+b")).test("a+b")).toBe(true))
