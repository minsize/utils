/**
 * Разделяет тысячи точками без изменения дробной части.
 *
 * @example
 * formatNumber(1234567) // "1.234.567"
 */
const formatNumber = (number: number) => {
  return (number || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

export default formatNumber
