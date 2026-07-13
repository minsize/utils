/** Loads image dimensions from a URL or Blob. @example const { width } = await getImageDimensions(file) */
function getImageDimensions(source: string | Blob): Promise<{ width: number; height: number }> {
  if (typeof Image === "undefined") return Promise.reject(new Error("Image is not available."))
  const isBlob = typeof source !== "string"
  if (isBlob && typeof URL.createObjectURL !== "function") return Promise.reject(new Error("Object URLs are not available."))
  const url = isBlob ? URL.createObjectURL(source) : source
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => { if (isBlob) URL.revokeObjectURL(url); resolve({ width: image.naturalWidth, height: image.naturalHeight }) }
    image.onerror = () => { if (isBlob) URL.revokeObjectURL(url); reject(new Error("Could not load image.")) }
    image.src = url
  })
}

export default getImageDimensions
