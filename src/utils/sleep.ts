/**
 *
 * @example
 * await sleep(1000)
 */
const sleep = async (time: number) => {
  return await new Promise((resolve) => setTimeout(resolve, time))
}

export default sleep
