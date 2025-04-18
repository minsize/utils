/**
 * Повторяет выполнение асинхронной функции до тех пор, пока она не завершится успешно или не будет достигнуто максимальное количество попыток.
 * @template T - Тип результата, который возвращает функция.
 * @param {() => Promise<T>} fn - Асинхронная функция, которую нужно выполнять повторно.
 * @param {number} retries - Максимальное количество попыток.
 * @param {number} delay - Интервал между попытками в миллисекундах.
 * @returns {Promise<T>} - Возвращает Promise с результатом выполнения функции или ошибкой после всех попыток.
 */
function retry<T>(
  fn: () => Promise<T>,
  retries: number,
  delay: number,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const attempt = (n: number) => {
      fn()
        .then(resolve)
        .catch((error) => {
          if (n === 0) {
            reject(error)
          } else {
            console.log(`Retrying... attempts left: ${n}`)
            setTimeout(() => attempt(n - 1), delay)
          }
        })
    }

    attempt(retries)
  })
}
export default retry
