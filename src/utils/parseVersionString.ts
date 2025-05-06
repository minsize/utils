function parseVersionString(versionString: string) {
  // Регулярное выражение для разбора строки версии
  const versionRegex = /^(\d+)\.(\d+)\.(\d+)(?:-([a-zA-Z0-9-.]+))?$/
  const match = versionString.match(versionRegex)

  if (!match) {
    throw new Error("Invalid version string")
  }

  // Разбиваем версию на части
  const [, major, minor, patch, prerelease] = match

  // Формируем JSON-объект
  return {
    major: parseInt(major, 10),
    minor: parseInt(minor, 10),
    patch: parseInt(patch, 10),
    prerelease: prerelease || null,
  }
}
export default parseVersionString
