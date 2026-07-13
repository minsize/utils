import { Mutex } from "@minsize/mutex"
import EventEmitter from "../events/eventemitter"

type Return<Result> = [Result, { duplicated: boolean }]

/**
 * Объединяет одновременные асинхронные операции с одинаковым ключом.
 * Первый вызов запускает callback, остальные получают его результат с `duplicated: true`.
 *
 * @example
 * const requests = new RequestDeduplicator()
 * await requests.fetch("user:1", () => fetch("/users/1").then((r) => r.json()))
 */
class RequestDeduplicator {
  private requests = new Set<string>()
  private emitter = new EventEmitter<{
    [key in string]: [
      | {
          result: any
          error?: undefined
        }
      | {
          result?: undefined
          error: any
        },
    ]
  }>()
  private mutex = Mutex({ globalLimit: 999_999 })

  /**
   * Выполняет callback или ожидает уже выполняющийся запрос с тем же ключом.
   *
   * @example
   * const [user, meta] = await requests.fetch("user:1", loadUser)
   * // meta.duplicated === false для исходного запроса
   */
  public async fetch<Result>(
    key: string,
    callback: () => Promise<Result>,
  ): Promise<Return<Result>> {
    const release = await this.mutex.wait({ key, limit: 1 })

    // Если запрос уже есть то ставим в ожидание
    if (this.requests.has(key)) {
      release()
      return new Promise<Return<Result>>((resolve, reject) => {
        this.emitter.once(key, (data) => {
          if (data.error) {
            reject(data.error)
          } else {
            resolve([data.result, { duplicated: true }])
          }
        })
      })
    }

    this.requests.add(key)
    release()

    return new Promise<Return<Result>>((resolve, reject) => {
      callback()
        .then((result) => {
          resolve([result, { duplicated: false }])
          this.emitter.emit(key, { result })
          this.requests.delete(key)
        })
        .catch((error) => {
          reject(error)
          this.emitter.emit(key, { error })
          this.requests.delete(key)
        })
    })
  }
}

export default RequestDeduplicator
