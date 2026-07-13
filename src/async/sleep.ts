/**
 * Возвращает Promise, который завершится через указанное число миллисекунд.
 *
 * @example
 * await sleep(1_000) // пауза на одну секунду
 */
const sleep = async (time: number) => {
  return await new Promise((resolve) => setTimeout(resolve, time))
}

export default sleep
