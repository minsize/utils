/**
 *
 * @example
 * copyText("Hello world") // return: boolean
 */
const copyText = (text?: string) => {
  if (!text) return false
  try {
    navigator.clipboard?.writeText(text)
    return true
  } catch {}
  try {
    var inp = document.createElement("input")
    inp.value = text
    document.body.appendChild(inp)
    inp.select()
    document.execCommand("copy")
    document.body.removeChild(inp)
    return true
  } catch {}
  return false
}

export default copyText
