/**
 * @param {number} seed - Начальное значение для генерации случайных чисел.
 * @returns {() => number} Функция для получения следующего случайного числа, возвращающая число в диапазоне [0, 1).
 */
function createEnhancedLCG(seed: number): () => number {
  const a = 1664525
  const c = 1013904223
  const m = 2 ** 32
  let state = seed

  /**
   * Функция перемешивания состояния для улучшения распределения.
   * @param {number} s - Состояние для перемешивания.
   * @returns {number} Перемешанное состояние.
   */
  function mixState(s: number): number {
    s ^= s >>> 21
    s ^= s << 35
    s ^= s >>> 4
    return s
  }

  return function generateRandom(): number {
    state = (a * state + c) % m
    state = mixState(state)
    return (state >>> 0) / m
  }
}

/**
 * Генерирует случайное целое число в заданном диапазоне [min, max].
 * @param {() => number} randomFunc - Функция, генерирующая случайное число от 0 до 1.
 * @param {number} min - Минимальная граница диапазона (включительно).
 * @param {number} max - Максимальная граница диапазона (включительно).
 * @returns {number} Случайное целое число в заданном диапазоне.
 */
function getRandomInt(
  randomFunc: () => number,
  min: number,
  max: number,
): number {
  if (min > max) {
    throw new Error("Минимальная граница не может быть больше максимальной.")
  }

  return Math.floor(randomFunc() * (max - min + 1)) + min
}

// Получение времени с точностью до наносекунд для использования в качестве seed.

function random(min: number, max: number, seed?: number) {
  if (!seed) {
    const time = new Date()
    seed =
      time.getDate() *
      time.getFullYear() *
      (time.getHours() ?? 1) *
      time.getMilliseconds()
  }
  const enhancedLcg = createEnhancedLCG(seed)

  return getRandomInt(enhancedLcg, min, max)
}

export default random
