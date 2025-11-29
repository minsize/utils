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

declare const formatNumber: (number: number) => string;

declare function random(min: number, max: number, seed?: number): number;

/**
 * Функция для выбора случайного элемента из объекта items на основе весов, с возможностью использования seed для случайности.
 * @template Items
 * @param {Items} items - Объект, представляющий элементы и их веса.
 * @param {number} [seed] - Необязательное значение для начального состояния генерации случайных чисел.
 * @returns {string} Выбор случайного элемента на основе указанных весов.
 */
declare function randomByWeight<Items extends Record<string, number>>(items: Items, seed?: number): Extract<keyof Items, string>;

type Type = "string" | "number" | "bigint" | "nan" | "boolean" | "object" | "array" | "function" | "null" | "undefined" | "symbol" | "date" | "regexp" | "error" | "unknown" | "map" | "set" | "weakmap" | "weakset" | "promise" | "buffer";
/**
 *
 * @example
 * isType({}) // return: "object"
 * isType({}, "object") // return: true
 */
declare function isType<Value>(value: Value, type: Type): boolean;
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

/**
 *
 * @example
 * await sleep(1000)
 */
declare const sleep: (time: number) => Promise<unknown>;

/**
 *
 * @example
 * copyText("Hello world") // return: boolean
 */
declare const copyText: (text?: string) => void;

declare const createLinksFromText: <T extends string, R extends unknown>(text: string, callback: (key: T, value: string) => R) => (string | R)[];

/**
 * Сравнивает два объекта на глубокое равенство, включая массивы (с учетом порядка).
 * Не сравнивает ссылки
 *
 * @example
 * const obj1 = { a: 1, b: { c: 2 } };
 * const obj2 = { a: 1, b: { c: 2 } };
 * comparison(obj1, obj2); // return: true
 *
 * @example
 * const obj3 = { a: 1, b: { c: 2 } };
 * const obj4 = { a: 1, b: { c: 3 } };
 * comparison(obj3, obj4); // return: false
 *
 * @example
 * const arr1 = [1, 2, 3];
 * const arr2 = [1, 2, 3];
 * comparison({ arr: arr1 }, { arr: arr2 }); // return: true
 *
 * @example
 * const arr3 = [1, 2, 3];
 * const arr4 = [3, 2, 1];
 * comparison({ arr: arr3 }, { arr: arr4 }); // return: false (порядок важен)
 */
declare const distributor: <VALUE extends unknown>(prev: VALUE, next: VALUE) => boolean;

/**
 * Генерирует уникальный ключ для произвольного JavaScript объекта, используя хеширование (без внешних библиотек).
 *
 * @param {any} obj Произвольный JavaScript объект (string, number, array, object, итд.).
 * @returns {string} Строка, представляющая собой уникальный ключ (хеш) для переданного объекта.
 */
declare const generateUniqueKey: <VALUE extends any>(obj: VALUE) => string;

declare const unlink: <VALUE extends any>(value: VALUE) => VALUE;

interface TextParserOptions {
    onToken?: (token: TextToken) => TextToken;
    requireProtocol?: boolean;
    regex?: RegExp;
}
type TextTokenType = "raw" | "url";
interface TextToken {
    type: TextTokenType;
    value: string;
}
declare const textParserUrl: (input: string, options?: TextParserOptions) => TextToken[];

/**
 * Функция мемоизации, которая сохраняет результаты вызовов функции `fn` с определенными аргументами.
 * @template F - Параметр типа для функции, которая принимается на вход.
 * @param {F} fn - Функция, результат выполнения которой необходимо запоминать.
 * @returns {F} - Меморизованная версия переданной функции.
 */
declare function memoize<F extends (...args: any[]) => any>(fn: F): F;

/**
 * Повторяет выполнение асинхронной функции до тех пор, пока она не завершится успешно или не будет достигнуто максимальное количество попыток.
 * @template T - Тип результата, который возвращает функция.
 * @param {() => Promise<T>} fn - Асинхронная функция, которую нужно выполнять повторно.
 * @param {number} retries - Максимальное количество попыток.
 * @param {number} delay - Интервал между попытками в миллисекундах.
 * @returns {Promise<T>} - Возвращает Promise с результатом выполнения функции или ошибкой после всех попыток.
 */
declare function retry<T>(fn: () => Promise<T>, retries: number, delay: number): Promise<T>;

/**
 * Разбирает строку запроса URL и возвращает объект с параметрами запроса.
 * @param {string} queryString - Строка запроса, начинающаяся с '?'.
 * @returns {Record<string, string>} - Объект, представляющий параметры запроса и их значения.
 */
declare function parseQueryString<Result extends Record<string, string>>(queryString: string): Result;

declare function parseVersionString(versionString: string): {
    major: number | "*";
    minor: number | "*";
    patch: number | "*";
    prerelease: string | null;
};

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
declare const elasticClamp: (value: number, min: number, max: number, options?: {
    threshold?: number;
    resistance?: number;
}) => number;

declare function updateCurrent<CURRENT extends unknown, NEXT extends unknown>(current: CURRENT, next: NEXT): CURRENT;

declare function getChangedData<VALUE extends unknown>(prev: VALUE, next: VALUE): VALUE | undefined;

/**
 *
 * @example
 * chunks(2, [1,2,3,4]) // [[1,2], [3,4]]
 */
declare const chunks: <T>(count: number, array: T[]) => T[][];

/**
 *
 * @example
 * shuffle([1,2,3]) // return: [2,1,3]
 * shuffle([1,2,3]) // return: [3,1,2]
 */
declare const shuffle: <T>(array: T[], seed?: number) => T[];

/**
 * Возвращает новый массив, содержащий только уникальные элементы из исходного массива.
 * @param {T[]} array - Исходный массив.
 * @returns {T[]} - Массив уникальных элементов.
 */
declare function unique<T>(array: T[]): T[];

/**
 * Группирует элементы массива по заданному критерию.
 * @param {T[]} array - Массив элементов, которые нужно сгруппировать.
 * @param {(item: T) => K} keyGetter - Функция, определяющая ключ группы для каждого элемента.
 * @returns {Record<string, T[]>} - Объект, где ключами являются результаты keyGetter, а значениями — массивы элементов.
 */
declare function groupBy<T, K extends string | number>(array: T[], keyGetter: (item: T) => K): Record<K, T[]>;

type SortDirection = "asc" | "desc";
type PathImpl<T, Key extends keyof T> = Key extends string ? T[Key] extends Record<string, any> ? Key | `${Key}.${PathImpl<T[Key], keyof T[Key]>}` : Key : never;
type Path<T> = PathImpl<T, keyof T>;
/**
 * Сортирует массив объектов по указанным вложенным ключам и направлениям.
 * @param array - Массив объектов для сортировки.
 * @param criteria - Объект, где ключи — путь к полям для сортировки (точечная нотация),
 * а значения — направления ('asc' или 'desc').
 * @returns Отсортированный массив.
 */
declare function orderBy<T>(array: T[], criteria: Partial<Record<Path<T>, SortDirection>>): T[];

/**
 * @returns [r,g,b]
 */
declare const HSVtoRGB: (h: number, s: number, v: number) => [number, number, number];

declare const RGBtoHEX: (r: number, g: number, b: number) => string;

/**
 * @returns [h,s,v]
 */
declare const RGBtoHSV: (r: number, g: number, b: number) => [number, number, number];

declare const HEXtoRGB: (hex: string) => [number, number, number];

type Callback<T extends unknown[] = unknown[]> = (...args: T) => void;
declare class EventEmitter<TEvents extends Record<string, unknown[]>> {
    e: Record<string, Callback[]>;
    /**
     * Подписка на событие
     * @param name - Имя события
     * @param callback - Функция-обработчик
     * @returns Функция для отписки
     */
    on<TEventName extends keyof TEvents & string>(name: TEventName, callback: Callback<TEvents[TEventName]>): () => void;
    /**
     * Отписка от события
     * @param name - Имя события
     * @param callback - Функция-обработчик для удаления
     */
    off<TEventName extends keyof TEvents & string>(name: TEventName, callback: Callback<TEvents[TEventName]>): void;
    /**
     * Инициация события
     * @param name - Имя события
     * @param args - Аргументы для обработчиков
     */
    emit<TEventName extends keyof TEvents & string>(name: TEventName, ...args: TEvents[TEventName]): void;
    /**
     * Подписка на событие один раз
     * @param name - Имя события
     * @param callback - Функция-обработчик
     * @returns Функция для отписки
     */
    once<TEventName extends keyof TEvents & string>(name: TEventName, callback: Callback<TEvents[TEventName]>): () => void;
    /**
     * Полная очистка всех подписчиков
     * @param name - Опциональное имя события (если не указано - очищаем все)
     */
    clear<TEventName extends keyof TEvents & string>(name?: TEventName): void;
}

/**
 * Функция для обновления текущих значений
 * Принимает текущие значения и возвращает новые
 */
type UpdaterFunction<T extends any[]> = (...current: Partial<T>) => T;
/**
 * Объект для частичного обновления значений
 * Каждый ключ соответствует частичному обновлению элемента массива
 */
type PartialUpdateObject<T extends any[]> = {
    [K in keyof T]?: T[K] extends object ? Partial<T[K]> : T[K];
};
type Options<T extends any[]> = {
    delay: number;
};
/**
 * Класс для отложенного выполнения функции с возможностью
 * накопления и обновления аргументов
 */
declare class DebouncedFunction<T extends any[]> {
    private readonly cb;
    private readonly o;
    private tId;
    private s;
    constructor(callback: (...args: T) => void, options: Options<T>);
    /**
     * Обновляет текущие аргументы с помощью функции обновления
     * @param updater Функция, которая получает текущие значения и возвращает новые
     */
    execute(fn: UpdaterFunction<T>): void;
    /**
     * Полностью заменяет текущие аргументы новыми значениями
     * @param args Новые значения аргументов
     */
    execute(...args: PartialUpdateObject<T>): void;
    /**
     * Немедленно выполняет функцию с текущими аргументами
     * и сбрасывает сохраненные аргументы
     */
    executeImmediately(): void;
    /**
     * Отменяет запланированное выполнение функции
     */
    cancel(): void;
}

declare class DataKeeper<VALUE extends unknown> {
    initValue: VALUE;
    currentValue: VALUE;
    constructor(value: VALUE);
    setter(updater: (value: VALUE) => VALUE): void;
    reset(value: VALUE): void;
    isModified(): boolean;
    get updateValues(): VALUE | undefined;
}

interface UrlRule {
    hosts: string[];
    paths?: (string | RegExp)[];
    hash?: (string | RegExp)[];
    allowedParams?: string[];
    ignoreParams?: string[];
    priority?: number;
    action?: UrlAction;
    id?: string;
}
declare enum UrlAction {
    ALLOW = 1,
    DENY = 2
}
/**
 * Менеджер безопасности URL
 * Обеспечивает проверку и контроль доступа к URL на основе настроенных правил
 *
 * @example
 * const securityManager = new UrlSecurityManager(ALLOWED_URLS);
 * if (securityManager.isAllowed(someUrl)) {
 *   openUrl(someUrl);
 * } else {
 *   showWarningModal(someUrl);
 * }
 */
declare class UrlSecurityManager {
    private rules;
    private cache;
    private cacheEnabled;
    /**
     * Создает экземпляр менеджера безопасности URL
     *
     * @param rules - Массив правил для проверки URL
     * @param enableCache - Включить кеширование результатов проверки для производительности
     */
    constructor(rules?: UrlRule[], enableCache?: boolean);
    /**
     * Проверяет, разрешен ли доступ к указанному URL
     *
     * @param inputUrl - URL для проверки (строка или объект URL)
     * @returns true если доступ разрешен, false если запрещен
     *
     * @example
     * securityManager.isAllowed('https://example.com') // true/false
     * securityManager.isAllowed(new URL('https://example.com')) // true/false
     */
    isAllowed(inputUrl: string | URL): boolean;
    /**
     * Оценивает URL по всем правилам в порядке приоритета
     * Первое совпавшее правило определяет результат
     *
     * @param url - URL объект для проверки
     * @returns Результат проверки доступа
     */
    private evaluateRules;
    /**
     * Проверяет соответствие URL конкретному правилу
     *
     * @param url - URL для проверки
     * @param rule - Правило для проверки
     * @returns true если URL соответствует правилу
     */
    private ruleMatches;
    /**
     * Проверяет соответствие хоста URL правилу
     *
     * @param rule - Правило для проверки
     * @param url - URL для проверки
     * @returns true если хост соответствует
     */
    private checkHost;
    /**
     * Проверяет соответствие пути URL правилу
     * Поддерживает как строки, так и регулярные выражения
     *
     * @param rule - Правило для проверки
     * @param url - URL для проверки
     * @returns true если путь соответствует
     */
    private checkPaths;
    /**
     * Проверяет соответствие hash части URL правилу
     * Поддерживает как строки, так и регулярные выражения
     *
     * @param rule - Правило для проверки
     * @param url - URL для проверки
     * @returns true если hash соответствует
     */
    private checkHash;
    /**
     * Проверяет параметры запроса URL на соответствие правилу
     *
     * @param rule - Правило для проверки
     * @param url - URL для проверки
     * @returns true если параметры соответствуют
     */
    private checkParams;
    /**
     * Обнаруживает обфусцированные и потенциально опасные URL
     *
     * @param url - URL для проверки
     * @returns true если URL считается обфусцированным
     */
    private isObfuscatedUrl;
    /**
     * Создает ключ для кеширования на основе нормализованного URL
     *
     * @param url - URL для нормализации
     * @returns Ключ кеша
     */
    private getCacheKey;
    /**
     * Логирует результат проверки доступа
     *
     * @param url - Проверяемый URL
     * @param allowed - Результат проверки
     */
    private logAccess;
    /**
     * Валидирует конфигурацию правил при инициализации
     * Выводит предупреждения в консоль при некорректных правилах
     */
    private validateConfig;
    /**
     * Находит правило, которое применилось к указанному URL
     * Полезно для отображения пользователю причины блокировки
     *
     * @param inputUrl - URL для проверки
     * @returns Найденное правило или null если не найдено
     *
     * @example
     * const rule = securityManager.findMatchingRule(blockedUrl);
     * console.log(`Access blocked by: ${rule?.id}`);
     */
    findMatchingRule(inputUrl: string | URL): UrlRule | null;
    /**
     * Очищает кеш проверок
     * Полезно при обновлении правил в runtime
     */
    clearCache(): void;
    /**
     * Включает или выключает кеширование
     *
     * @param enabled - Состояние кеширования
     */
    setCacheEnabled(enabled: boolean): void;
    /**
     * Возвращает текущее количество закешированных результатов
     *
     * @returns Количество закешированных записей
     */
    getCacheSize(): number;
}

export { DataKeeper, DebouncedFunction, EventEmitter, HEXtoRGB, HSVtoRGB, RGBtoHEX, RGBtoHSV, UrlAction, type UrlRule, UrlSecurityManager, alignTo, chunks, clamp, distributor as comparison, copyText, createLinksFromText, decWord, elasticClamp, formatNumber, generateUniqueKey, getChangedData, groupBy, isType, memoize, omit, orderBy, parseQueryString, parseVersionString, pick, random, randomByWeight, retry, shuffle, sleep, textParserUrl, timeAgo, toShort, unique, unlink, updateCurrent };
