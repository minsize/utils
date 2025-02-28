interface TextParserOptions {
  onToken?: (token: TextToken) => TextToken
  requireProtocol?: boolean
  regex?: RegExp
}

type TextTokenType = "raw" | "url"

interface TextToken {
  type: TextTokenType
  value: string
}

const defaultOnToken = (e: TextToken): TextToken => e

const textParserUrl = (
  input: string,
  options?: TextParserOptions,
): TextToken[] => {
  const onToken = options?.onToken ?? defaultOnToken
  const requireProtocol = options?.requireProtocol ?? false
  const regex =
    options?.regex ??
    new RegExp(
      `((?:https?(?::\/\/))${
        requireProtocol ? "" : "?"
      }(?:www\.)?[a-zA-Z0-9-_\S]+(?:\.[a-zA-Z0-9]{2,})(?:[-a-zA-Z0-9:%_+.~#?&//=@]*))`,
    )

  const ast: TextToken[] = []
  let remainingInput = input
  let match = regex.exec(remainingInput)

  while (match) {
    const url = match[0]
    const urlIndex = match.index

    if (urlIndex > 0) {
      ast.push(
        onToken({
          type: "raw",
          value: remainingInput.substring(0, urlIndex),
        }),
      )
      remainingInput = remainingInput.substring(urlIndex)
    }

    ast.push(
      onToken({
        type: "url",
        value: url,
      }),
    )

    remainingInput = remainingInput.substring(url.length)
    match = regex.exec(remainingInput) // Use regex.exec correctly
  }

  if (remainingInput.length > 0) {
    ast.push(
      onToken({
        type: "raw",
        value: remainingInput,
      }),
    )
  }

  return ast
}

export default textParserUrl
