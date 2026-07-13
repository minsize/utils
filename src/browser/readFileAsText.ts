/** Reads a Blob or File as text. @example const text = await readFileAsText(file) */
const readFileAsText = (file: Blob): Promise<string> => file.text()

export default readFileAsText
