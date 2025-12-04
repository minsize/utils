import { Mutex } from "@minsize/mutex"
import EventEmitter from "./eventemitter"

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

  public async fetch<Result>(
    key: string,
    callback: () => Promise<Result>,
  ): Promise<Result> {
    const release = await this.mutex.wait({ key, limit: 1 })

    // Если запрос уже есть то ставим в ожидание
    if (this.requests.has(key)) {
      release()
      return new Promise<Result>((resolve, reject) => {
        this.emitter.once(key, (data) => {
          if (data.error) {
            reject(data.error)
          } else {
            resolve(data.result)
          }
        })
      })
    }

    this.requests.add(key)
    release()

    return new Promise((resolve, reject) => {
      callback()
        .then((result) => {
          resolve(result)
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
