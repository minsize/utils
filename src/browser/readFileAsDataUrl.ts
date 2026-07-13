/** Reads a Blob or File as a data URL. @example const source = await readFileAsDataUrl(file) */
function readFileAsDataUrl(file: Blob): Promise<string> {
  if (typeof FileReader === "undefined") return Promise.reject(new Error("FileReader is not available."))
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(reader.error ?? new Error("Could not read file."))
    reader.onload = () => resolve(String(reader.result))
    reader.readAsDataURL(file)
  })
}

export default readFileAsDataUrl
