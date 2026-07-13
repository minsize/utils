import { decWord } from "../src"

describe("decWord", () => {
  it("selects the Russian word form for a number", () => {
    const forms = ["файл", "файла", "файлов"]

    expect(decWord(1, forms)).toBe("файл")
    expect(decWord(22, forms)).toBe("файла")
    expect(decWord(15, forms)).toBe("файлов")
  })
})
