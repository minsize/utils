/**
 * Public API for `@minsize/utils`.
 *
 * Import utilities from the package root:
 *
 * @example
 * import { clamp, groupBy } from "@minsize/utils"
 */

// Arrays
export { default as chunks } from "./array/chunks"
export { default as groupBy } from "./array/groupBy"
export { default as orderBy } from "./array/orderBy"
export { default as shuffle } from "./array/shuffle"
export { default as unique } from "./array/unique"

// Async control flow
export { default as DebouncedFunction } from "./async/debouncedFunction"
export { default as once } from "./async/once"
export { default as RequestDeduplicator } from "./async/RequestDeduplicator"
export { default as retry } from "./async/retry"
export { default as sleep } from "./async/sleep"

// Browser APIs
export { default as copyText } from "./browser/copyText"
export { default as createLinksFromText } from "./browser/createLinksFromText"
export { default as ObjectURLManager } from "./browser/ObjectURLManager"

// Colors
export { default as HEXtoRGB } from "./color/HEXtoRGB"
export { default as HSVtoRGB } from "./color/HSVtoRGB"
export { default as RGBtoHEX } from "./color/RGBtoHEX"
export { default as RGBtoHSV } from "./color/RGBtoHSV"

// Data and objects
export { default as comparison } from "./data/comparison"
export { default as DataKeeper } from "./data/DataKeeper"
export { default as generateUniqueKey } from "./data/generateUniqueKey"
export { default as getChangedData } from "./data/getChangedData"
export { default as isType } from "./data/isType"
export { default as memoize } from "./data/memoize"
export { default as omit } from "./data/omit"
export { default as pick } from "./data/pick"
export { default as unlink } from "./data/unlink"
export { default as updateCurrent } from "./data/updateCurrent"

// Date and events
export { default as timeAgo } from "./date/timeAgo"
export { default as EventEmitter } from "./events/eventemitter"

// Numbers
export { default as alignTo } from "./number/alignTo"
export { default as clamp } from "./number/clamp"
export { default as decWord } from "./number/decWord"
export { default as elasticClamp } from "./number/elasticClamp"
export { default as formatNumber } from "./number/formatNumber"
export { default as random } from "./number/random"
export { default as randomByWeight } from "./number/randomByWeight"
export { default as toShort } from "./number/toShort"

// Text
export { default as parseTextTokens } from "./text/parseTextTokens"
export { default as parseVersionString } from "./text/parseVersionString"
export { default as textParserUrl } from "./text/textParserUrl"

// URLs
export {
  default as UrlSecurityManager,
  UrlAction,
  type UrlRule,
} from "./url/UrlSecurityManager"
export { default as parseQueryString } from "./url/parseQueryString"
