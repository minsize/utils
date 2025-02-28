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

const regexp = new RegExp(
  /(?:https?:\/\/)?(?:www\.)?([А-Яа-яa-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.(?:ru|com|org|net|me|su|рф|biz|info|co|uk|de|fr|jp|cn|es|it|ca|au|nl|se|no|dk|fi|pl|at|ch|be|cz|ie|pt|ro|hu|gr|sk|bg|hr|si|lt|lv|ee|is|mt|lu|li|mc|sm|va|ad|al|ba|mk|me|rs|tr|ua|by|kz|uz|am|ge|az|tm|kg|tj|md|kg|tj|af|dz|bh|eg|iq|ir|jo|kw|lb|ly|ma|om|ps|qa|sa|sd|sy|tn|ae|ye|ar|bo|br|cl|co|ec|gf|gy|pe|py|sr|uy|ve|ag|ai|aw|bb|bm|bs|bz|ca|cr|cu|dm|do|gd|gp|gt|hn|ht|jm|kn|ky|lc|ms|mx|ni|pa|pr|sv|tc|tt|vc|vg|vi|an|aq|as|fj|fm|gu|hm|id|ki|mh|mp|nc|nf|nr|nu|pf|pg|pw|sb|tk|to|tv|vu|wf|ws)(?:\/[a-zA-Z0-9._~:\/?#[\]@!$&'()*+,;=-]*)?)/,
)
const regexpRequireProtocol = new RegExp(
  /(?:https?:\/\/)(?:www\.)?([А-Яа-яa-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.(?:ru|com|org|net|me|su|рф|biz|info|co|uk|de|fr|jp|cn|es|it|ca|au|nl|se|no|dk|fi|pl|at|ch|be|cz|ie|pt|ro|hu|gr|sk|bg|hr|si|lt|lv|ee|is|mt|lu|li|mc|sm|va|ad|al|ba|mk|me|rs|tr|ua|by|kz|uz|am|ge|az|tm|kg|tj|md|kg|tj|af|dz|bh|eg|iq|ir|jo|kw|lb|ly|ma|om|ps|qa|sa|sd|sy|tn|ae|ye|ar|bo|br|cl|co|ec|gf|gy|pe|py|sr|uy|ve|ag|ai|aw|bb|bm|bs|bz|ca|cr|cu|dm|do|gd|gp|gt|hn|ht|jm|kn|ky|lc|ms|mx|ni|pa|pr|sv|tc|tt|vc|vg|vi|an|aq|as|fj|fm|gu|hm|id|ki|mh|mp|nc|nf|nr|nu|pf|pg|pw|sb|tk|to|tv|vu|wf|ws)(?:\/[a-zA-Z0-9._~:\/?#[\]@!$&'()*+,;=-]*)?)/,
)

const defaultOnToken = (e: TextToken): TextToken => e

const textParserUrl = (
  input: string,
  options?: TextParserOptions,
): TextToken[] => {
  const onToken = options?.onToken ?? defaultOnToken
  const requireProtocol = options?.requireProtocol ?? false
  const regex =
    options?.regex ?? requireProtocol ? regexpRequireProtocol : regexp

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
