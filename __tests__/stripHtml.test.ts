import { stripHtml } from "../src"
test("stripHtml", () => expect(stripHtml("<p>Hello <b>world</b></p>")).toBe("Hello world"))
