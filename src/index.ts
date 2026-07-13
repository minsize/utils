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
export { default as debounce } from "./async/debounce"
export { default as createAbortTimeout } from "./async/createAbortTimeout"
export { default as isAbortError } from "./async/isAbortError"
export { default as once } from "./async/once"
export { default as RequestDeduplicator } from "./async/RequestDeduplicator"
export { default as retry } from "./async/retry"
export { default as sleep } from "./async/sleep"
export { default as throttle } from "./async/throttle"
export { default as withTimeout } from "./async/withTimeout"

// Browser APIs
export { default as copyText } from "./browser/copyText"
export { default as copyImageToClipboard } from "./browser/copyImageToClipboard"
export { default as createMediaQuery } from "./browser/createMediaQuery"
export { default as createLinksFromText } from "./browser/createLinksFromText"
export { default as downloadBlob } from "./browser/downloadBlob"
export { default as focusFirst } from "./browser/focusFirst"
export { default as focusLast } from "./browser/focusLast"
export { default as getCookie } from "./browser/getCookie"
export { default as getCssVariable } from "./browser/getCssVariable"
export { default as getDevicePixelRatio } from "./browser/getDevicePixelRatio"
export {
  default as getElementOffset,
  type ElementOffset,
} from "./browser/getElementOffset"
export { default as getFocusableElements } from "./browser/getFocusableElements"
export { default as getImageDimensions } from "./browser/getImageDimensions"
export {
  default as getSafeAreaInsets,
  type SafeAreaInsets,
} from "./browser/getSafeAreaInsets"
export { default as getScrollParent } from "./browser/getScrollParent"
export { default as getScrollbarWidth } from "./browser/getScrollbarWidth"
export { default as getStorageItem } from "./browser/getStorageItem"
export { default as isBrowser } from "./browser/isBrowser"
export { default as isElementVisible } from "./browser/isElementVisible"
export { default as isMobileViewport } from "./browser/isMobileViewport"
export { default as isTouchDevice } from "./browser/isTouchDevice"
export { default as nextFrame } from "./browser/nextFrame"
export { default as ObjectURLManager } from "./browser/ObjectURLManager"
export { default as parseCookies } from "./browser/parseCookies"
export {
  default as prefersColorScheme,
  type ColorSchemePreference,
} from "./browser/prefersColorScheme"
export { default as prefersReducedMotion } from "./browser/prefersReducedMotion"
export { default as readFileAsDataUrl } from "./browser/readFileAsDataUrl"
export { default as readFileAsText } from "./browser/readFileAsText"
export { default as removeCookie } from "./browser/removeCookie"
export { default as removeStorageItem } from "./browser/removeStorageItem"
export { default as scrollIntoViewIfNeeded } from "./browser/scrollIntoViewIfNeeded"
export { default as setCookie, type CookieOptions } from "./browser/setCookie"
export { default as setCssVariable } from "./browser/setCssVariable"
export { default as setStorageItem } from "./browser/setStorageItem"
export { default as trapFocus } from "./browser/trapFocus"
export { default as waitForAnimationFrame } from "./browser/waitForAnimationFrame"
export { default as waitForTransition } from "./browser/waitForTransition"

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
export { default as safeJsonParse } from "./data/safeJsonParse"
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
export { default as formatBytes } from "./number/formatBytes"
export { default as formatDuration } from "./number/formatDuration"
export { default as formatNumber } from "./number/formatNumber"
export { default as random } from "./number/random"
export { default as randomByWeight } from "./number/randomByWeight"
export { default as toShort } from "./number/toShort"

// Text
export { default as capitalize } from "./text/capitalize"
export { default as escapeRegExp } from "./text/escapeRegExp"
export { default as getFileExtension } from "./text/getFileExtension"
export { default as getFileNameWithoutExtension } from "./text/getFileNameWithoutExtension"
export { default as isEmail } from "./text/isEmail"
export { default as isUrl } from "./text/isUrl"
export { default as parseTextTokens } from "./text/parseTextTokens"
export { default as parseVersionString } from "./text/parseVersionString"
export { default as stripHtml } from "./text/stripHtml"
export { default as textParserUrl } from "./text/textParserUrl"
export { default as toCamelCase } from "./text/toCamelCase"
export { default as toKebabCase } from "./text/toKebabCase"
export { default as toSnakeCase } from "./text/toSnakeCase"
export { default as truncate } from "./text/truncate"

// URLs
export {
  default as UrlSecurityManager,
  UrlAction,
  type UrlRule,
} from "./url/UrlSecurityManager"
export { default as parseQueryString } from "./url/parseQueryString"
