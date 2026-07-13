const toWords = (value: string): string[] =>
  (value.replace(/([\p{Ll}\p{N}])([\p{Lu}])/gu, "$1 $2").match(/[\p{L}\p{N}]+/gu) ?? []).map(
    (word) => word.toLowerCase(),
  )

export default toWords
