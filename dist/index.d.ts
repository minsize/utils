/**
 *
 * @example
 * chunks(2, [1,2,3,4]) // [[1,2], [3,4]]
 */
declare const chunks: <T>(count: number, array: T[]) => T[][];

/**
 *
 * @example
 * clamp(10, 1, 10) // return: 10
 * clamp(0, 1, 10) // return: 1
 * clamp(11, 1, 10) // return: 10
 */
declare const clamp: (value: number, min: number, max: number) => number;

declare const decWord: (n: number, words: string[]) => string;

/**
 *
 * @example
 * alignTo(1, 4) // return: 4
 * alignTo(3, 4) // return: 4
 * alignTo(5, 4) // return: 8
 * alignTo(9, 4) // return: 12
 */
declare function alignTo(num: number, by: number): number;

declare const toShort: (number: number, customParts?: string[], fixed?: number) => string;

declare const timeAgo: (timestamp: number) => string;

declare const formatNumber: (number: number) => string | 0;

/**
 *
 * @example
 * shuffle([1,2,3]) // return: [2,1,3]
 * shuffle([1,2,3]) // return: [3,1,2]
 */
declare const shuffle: <T>(array: T[]) => T[];

declare const random: (min: number, max: number) => number;

type Type = "string" | "number" | "bigint" | "nan" | "boolean" | "object" | "array" | "function" | "null" | "undefined" | "symbol" | "date" | "regexp" | "error" | "unknown" | "map" | "set" | "weakmap" | "weakset" | "promise" | "buffer";
/**
 *
 * @example
 * isType({}) // return: "object"
 * isType({}, "object") // return: true
 */
declare function isType<Value>(value: Value, _type: Type): boolean;
declare function isType<Value>(value: Value): Type;

/**
 *
 * @example
 * omit({ key: "1", id: "2" }, ["key"]) // return: { key: "1" }
 */
declare function omit<T extends object, K extends keyof T>(object: T, keys: K[]): Omit<T, K>;

/**
 *
 * @example
 * pick({ key: "1", id: "2" }, ["key"]) // return: { key: "1" }
 */
declare function pick<T extends object, K extends keyof T>(object: T, keys: K[]): Pick<T, K>;

export { alignTo, chunks, clamp, decWord, formatNumber, isType, omit, pick, random, shuffle, timeAgo, toShort };