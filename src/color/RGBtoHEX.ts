/** Преобразует один RGB-компонент в двухсимвольную шестнадцатеричную строку. */
const componentToHex = (c: number) => {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

/**
 * Преобразует RGB-компоненты в HEX-строку.
 *
 * @example
 * RGBtoHEX(255, 128, 0) // "#ff8000"
 */
const RGBtoHEX = (r: number, g: number, b: number) => {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export default RGBtoHEX;
