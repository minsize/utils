/**
 *
 * @example
 * copyText("Hello world") // return: boolean
 */
const copyText = (text?: string) => {
  if (!text) return
  try {
    navigator.clipboard?.writeText(text)
  } catch {}
  try {
    var inp = document.createElement("input")
    inp.value = text
    document.body.appendChild(inp)
    inp.select()
    document.execCommand("copy")
    document.body.removeChild(inp)
  } catch {}
}

export default copyText
