/**
 * Elastic clamp - возвращает значение с "упругим" эффектом при выходе за границы
 * @param value - входное значение
 * @param min - минимальная граница
 * @param max - максимальная граница
 * @param options - параметры эффекта
 * @param options.threshold - порог, после которого сопротивление усиливается (по умолчанию: 50)
 * @param options.resistance - коэффициент сопротивления (по умолчанию: 0.2)
 * @example
 * elasticClamp(10, 1, 10) // return: 10
 * elasticClamp(0, 1, 10)  // return: 0.99 (примерно 1 с elastic effect)
 * elasticClamp(11, 1, 10) // return: 10.99 (примерно 10 + elastic effect)
 */
const elasticClamp = (
  value: number,
  min: number,
  max: number,
  options: {
    threshold?: number
    resistance?: number
  } = {},
) => {
  const { threshold = 50, resistance = 0.2 } = options

  return value < min
    ? min - threshold * (1 - Math.exp(((min - value) * resistance) / threshold))
    : value > max
    ? max + threshold * (1 - Math.exp(((value - max) * resistance) / threshold))
    : value
}

export default elasticClamp
