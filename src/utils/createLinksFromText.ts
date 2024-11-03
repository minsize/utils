const createLinksFromText = <T extends string, R extends unknown>(
  text: string,
  callback: (key: T, value: string) => R,
) => {
  const result = []
  const regex = /{{([^}]+):([^}]+)}}/g
  let lastIndex = 0

  let match
  while ((match = regex.exec(text)) !== null) {
    result.push(text.substring(lastIndex, match.index))
    lastIndex = match.index + match[0].length

    result.push({
      key: match[1],
      text: match[2],
    })
  }
  result.push(text.substring(lastIndex))

  return result.map((x) =>
    typeof x === "string" ? x : callback(x.key as T, x.text),
  )
}

export default createLinksFromText
