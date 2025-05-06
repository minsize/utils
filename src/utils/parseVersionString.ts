function parseVersionString(versionString: string) {
  // Регулярное выражение для разбора строки версии
  const versionRegex = /^(\d+|\*)\.(\d+|\*)\.(\d+|\*)(?:-([a-zA-Z0-9-.]+))?$/
  const match = versionString.match(versionRegex)

  if (!match) {
    throw new Error("Invalid version string")
  }

  // Разбиваем версию на части
  const [, major, minor, patch, prerelease] = match

  // Проверяем 'X' и '*' чтобы возвращать `null`
  const parsePart = (part: string): number | "*" => {
    if (part === "*") return "*"

    return parseInt(part, 10)
  }

  // Формируем JSON-объект
  return {
    major: parsePart(major),
    minor: parsePart(minor),
    patch: parsePart(patch),
    prerelease: prerelease || null,
  }
}
export default parseVersionString
