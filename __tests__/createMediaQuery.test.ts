import { createMediaQuery } from "../src"
test("createMediaQuery returns an SSR-safe unsubscribe", () => expect(createMediaQuery("(min-width: 1px)", jest.fn())()).toBeUndefined())
