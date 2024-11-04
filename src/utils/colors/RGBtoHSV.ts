/**
 * @returns [h,s,v]
 */
const RGBtoHSV = (
  r: number,
  g: number,
  b: number,
): [number, number, number] => {
  var max = Math.max(r, g, b),
    min = Math.min(r, g, b),
    d = max - min,
    h = 0,
    s = max === 0 ? 0 : d / max,
    v = max / 255

  switch (max) {
    case min:
      h = 0
      break
    case r:
      h = g - b + d * (g < b ? 6 : 0)
      h /= 6 * d
      break
    case g:
      h = b - r + d * 2
      h /= 6 * d
      break
    case b:
      h = r - g + d * 4
      h /= 6 * d
      break
  }

  return [h, s, v]
}

export default RGBtoHSV
