/** Downloads a Blob using a temporary object URL. @example downloadBlob(new Blob(["text"]), "note.txt") */
function downloadBlob(blob: Blob, fileName: string): boolean {
  if (typeof document === "undefined" || typeof URL.createObjectURL !== "function") return false
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = fileName
  link.style.display = "none"
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
  return true
}

export default downloadBlob
