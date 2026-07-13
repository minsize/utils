import { getElementOffset } from "../src"
test("getElementOffset", () => expect(getElementOffset({ getBoundingClientRect: () => ({ top: 4, left: 8 }) } as unknown as Element)).toEqual({ top: 4, left: 8 }))
