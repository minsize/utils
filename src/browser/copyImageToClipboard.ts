/** Copies an image Blob to the clipboard when the browser supports it. @example await copyImageToClipboard(blob) */
async function copyImageToClipboard(blob: Blob): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.clipboard?.write || typeof ClipboardItem === "undefined" || !blob.type) return false
  try {
    await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })])
    return true
  } catch { return false }
}

export default copyImageToClipboard
