/** Removes the final extension from a file name. @example getFileNameWithoutExtension("photo.png") // "photo" */
const getFileNameWithoutExtension = (value: string): string => {
  const fileName = value.split(/[?#]/, 1)[0].split("/").pop() ?? ""
  const index = fileName.lastIndexOf(".")
  return index > 0 ? fileName.slice(0, index) : fileName
}

export default getFileNameWithoutExtension
