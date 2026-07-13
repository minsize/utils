/** Returns a lowercase file extension without a dot. @example getFileExtension("photo.PNG") // "png" */
const getFileExtension = (value: string): string => {
  const fileName = value.split(/[?#]/, 1)[0].split("/").pop() ?? ""
  const index = fileName.lastIndexOf(".")
  return index > 0 && index < fileName.length - 1 ? fileName.slice(index + 1).toLowerCase() : ""
}

export default getFileExtension
