/**
 * Разбивает массив на последовательные части указанного размера.
 *
 * @example
 * chunks(2, [1, 2, 3, 4, 5]) // [[1, 2], [3, 4], [5]]
 */
declare const chunks: <T>(count: number, array: T[]) => T[][];

/**
 * Группирует элементы массива по заданному критерию.
 * @param {T[]} array - Массив элементов, которые нужно сгруппировать.
 * @param {(item: T) => K} keyGetter - Функция, определяющая ключ группы для каждого элемента.
 * @returns {Record<string, T[]>} - Объект, где ключами являются результаты keyGetter, а значениями — массивы элементов.
 *
 * @example
 * groupBy(["ant", "bear"], (word) => word.length) // { 3: ["ant"], 4: ["bear"] }
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
 *
 * @example
 * orderBy([{ score: 2 }, { score: 1 }], { score: "asc" }) // [{ score: 1 }, { score: 2 }]
 */
declare function orderBy<T>(array: T[], criteria: Partial<Record<Path<T>, SortDirection>>): T[];

/**
 * Перемешивает элементы на месте и возвращает тот же массив.
 * Передача `seed` делает результат воспроизводимым для одного запуска.
 *
 * @example
 * shuffle([1, 2, 3], 42) // например, [2, 3, 1]
 */
declare const shuffle: <T>(array: T[], seed?: number) => T[];

/**
 * Возвращает новый массив, содержащий только уникальные элементы из исходного массива.
 * @param {T[]} array - Исходный массив.
 * @returns {T[]} - Массив уникальных элементов.
 */
declare function unique<T>(array: T[]): T[];

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
 *
 * @example
 * const search = new DebouncedFunction(console.log, { delay: 250 })
 * search.execute("query")
 */
declare class DebouncedFunction<T extends any[]> {
    private readonly cb;
    private readonly o;
    private tId;
    private s;
    /** Создаёт отложенный вызов с указанной задержкой. */
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

type Debounced<F extends (...args: any[]) => any> = ((...args: Parameters<F>) => void) & {
    cancel: () => void;
    flush: () => ReturnType<F> | undefined;
    pending: () => boolean;
};
/**
 * Откладывает вызов функции до завершения паузы между вызовами.
 *
 * @example
 * const search = debounce((query: string) => loadResults(query), 250)
 * search("utils")
 * search.cancel()
 */
declare function debounce<F extends (...args: any[]) => any>(callback: F, delay: number): Debounced<F>;

/** Creates an AbortSignal that aborts after a timeout. @example fetch("/api", { signal: createAbortTimeout(5_000) }) */
declare function createAbortTimeout(timeout: number): AbortSignal;

/** Checks whether an error represents an aborted async operation. @example isAbortError({ name: "AbortError" }) // true */
declare const isAbortError: (error: unknown) => boolean;

/**
 * Возвращает обёртку, которая вызывает исходную функцию только при первом вызове.
 * Повторные вызовы возвращают результат первого.
 *
 * @example
 * const initialize = once(() => "ready")
 * initialize() // "ready"
 * initialize() // "ready"; исходная функция больше не запускается
 */
declare function once<T extends (...args: any[]) => any>(fn: T): (...args: Parameters<T>) => ReturnType<T>;

type Return<Result> = [Result, {
    duplicated: boolean;
}];
/**
 * Объединяет одновременные асинхронные операции с одинаковым ключом.
 * Первый вызов запускает callback, остальные получают его результат с `duplicated: true`.
 *
 * @example
 * const requests = new RequestDeduplicator()
 * await requests.fetch("user:1", () => fetch("/users/1").then((r) => r.json()))
 */
declare class RequestDeduplicator {
    private requests;
    private emitter;
    private mutex;
    /**
     * Выполняет callback или ожидает уже выполняющийся запрос с тем же ключом.
     *
     * @example
     * const [user, meta] = await requests.fetch("user:1", loadUser)
     * // meta.duplicated === false для исходного запроса
     */
    fetch<Result>(key: string, callback: () => Promise<Result>): Promise<Return<Result>>;
}

/**
 * Повторяет выполнение асинхронной функции до тех пор, пока она не завершится успешно или не будет достигнуто максимальное количество попыток.
 * @template T - Тип результата, который возвращает функция.
 * @param {() => Promise<T>} fn - Асинхронная функция, которую нужно выполнять повторно.
 * @param {number} retries - Максимальное количество попыток.
 * @param {number} delay - Интервал между попытками в миллисекундах.
 * @returns {Promise<T>} - Возвращает Promise с результатом выполнения функции или ошибкой после всех попыток.
 *
 * @example
 * const response = await retry(() => fetch("/api").then((r) => r.json()), 3, 500)
 */
declare function retry<T>(fn: () => Promise<T>, retries: number, delay: number): Promise<T>;

/**
 * Возвращает Promise, который завершится через указанное число миллисекунд.
 *
 * @example
 * await sleep(1_000) // пауза на одну секунду
 */
declare const sleep: (time: number) => Promise<unknown>;

type Throttled<F extends (...args: any[]) => any> = ((...args: Parameters<F>) => void) & {
    cancel: () => void;
    flush: () => ReturnType<F> | undefined;
    pending: () => boolean;
};
/**
 * Ограничивает частоту вызова функции, сохраняя последний вызов для конца интервала.
 *
 * @example
 * const onScroll = throttle(() => updateHeader(), 100)
 * window.addEventListener("scroll", onScroll)
 */
declare function throttle<F extends (...args: any[]) => any>(callback: F, delay: number): Throttled<F>;

/** Rejects a promise if it does not settle in time. @example await withTimeout(fetch("/api"), 5_000) */
declare function withTimeout<T>(promise: PromiseLike<T>, timeout: number): Promise<T>;

/**
 * Пытается скопировать непустой текст в буфер обмена браузера.
 * Использует Clipboard API, а затем устаревший fallback через `execCommand`.
 *
 * @example
 * copyText("Hello, world!")
 */
declare const copyText: (text?: string) => void;

/** Copies an image Blob to the clipboard when the browser supports it. @example await copyImageToClipboard(blob) */
declare function copyImageToClipboard(blob: Blob): Promise<boolean>;

/** Subscribes to a media query and returns an unsubscribe function. @example const stop = createMediaQuery("(min-width: 768px)", console.log) */
declare function createMediaQuery(query: string, listener: (matches: boolean) => void): () => void;

/**
 * Заменяет шаблоны `{{key:text}}` результатом callback-функции, сохраняя обычный текст.
 *
 * @example
 * createLinksFromText("Open {{docs:documentation}}", (key, text) => ({ key, text }))
 * // ["Open ", { key: "docs", text: "documentation" }, ""]
 */
declare const createLinksFromText: <T extends string, R extends unknown>(text: string, callback: (key: T, value: string) => R) => (string | R)[];

/** Downloads a Blob using a temporary object URL. @example downloadBlob(new Blob(["text"]), "note.txt") */
declare function downloadBlob(blob: Blob, fileName: string): boolean;

/** Focuses the first focusable child. @example focusFirst(dialog) */
declare function focusFirst(container: ParentNode): HTMLElement | undefined;

/** Focuses the last focusable child. @example focusLast(dialog) */
declare function focusLast(container: ParentNode): HTMLElement | undefined;

/** Reads a cookie by name. @example getCookie("theme") // "dark" */
declare const getCookie: (name: string, value?: string) => string | undefined;

/** Reads a CSS custom property. @example getCssVariable("--brand-color") */
declare function getCssVariable(name: string, element?: Element): string | undefined;

/** Returns devicePixelRatio with an SSR-safe fallback. @example getDevicePixelRatio() // 2 */
declare const getDevicePixelRatio: () => number;

type ElementOffset = {
    top: number;
    left: number;
};
/** Returns an element position relative to the document. @example getElementOffset(button) // { top: 120, left: 20 } */
declare function getElementOffset(element: Element): ElementOffset;

/**
 * Возвращает доступные для фокуса элементы внутри контейнера.
 * Без DOM API безопасно возвращает пустой массив.
 *
 * @example
 * const focusable = getFocusableElements(dialog)
 * focusable[0]?.focus()
 */
declare function getFocusableElements(container?: ParentNode): HTMLElement[];

/** Loads image dimensions from a URL or Blob. @example const { width } = await getImageDimensions(file) */
declare function getImageDimensions(source: string | Blob): Promise<{
    width: number;
    height: number;
}>;

type SafeAreaInsets = {
    top: number;
    right: number;
    bottom: number;
    left: number;
};
/** Reads CSS safe-area inset values. @example getSafeAreaInsets() // { top: 0, right: 0, bottom: 34, left: 0 } */
declare function getSafeAreaInsets(): SafeAreaInsets;

/** Finds the nearest scrollable parent. @example getScrollParent(menu) */
declare function getScrollParent(element: HTMLElement): HTMLElement | null;

/** Returns the current vertical scrollbar width. @example getScrollbarWidth() // 15 */
declare const getScrollbarWidth: () => number;

/** Reads a JSON value from localStorage without throwing during SSR or quota errors. @example getStorageItem("theme", "light") */
declare function getStorageItem<T>(key: string): T | undefined;
declare function getStorageItem<T>(key: string, fallback: T): T;

/**
 * Проверяет наличие DOM API. Подходит для защиты кода при SSR.
 *
 * @example
 * if (isBrowser()) window.scrollTo(0, 0)
 */
declare const isBrowser: () => boolean;

/** Checks whether an element intersects the viewport. @example isElementVisible(banner, 16) */
declare function isElementVisible(element: Element, offset?: number): boolean;

/** Checks whether the current viewport is below a breakpoint. @example isMobileViewport() // true */
declare const isMobileViewport: (breakpoint?: number) => boolean;

/** Checks for touch input support. @example isTouchDevice() // true */
declare const isTouchDevice: () => boolean;

/** Alias for waitForAnimationFrame. @example await nextFrame() */
declare const nextFrame: () => Promise<number>;

/**
 * Хранит созданные object URL и помогает вовремя освободить связанные ресурсы.
 *
 * @example
 * const urls = new ObjectURLManager()
 * const url = urls.createWithAutoRevoke("preview", new Blob(["text"]), 30_000)
 */
declare class ObjectURLManager {
    private urls;
    /**
     * Создает URL и устанавливает время открытия
     * @param key - Уникальный ключ
     * @param obj - объект
     * @param ttl - Время жизни в миллисекундах после создания
     * @returns {string} - Созданный URL
     *
     * @example
     * urls.create("avatar", file, 60_000)
     */
    create(key: string, obj: Parameters<typeof URL.createObjectURL>["0"], ttl: number): string;
    /**
     * Обновляет время последнего открытия URL
     * @param key - URL для обновления
     * @returns {boolean} - Успешно ли обновлено
     *
     * @example
     * urls.access("avatar") // true
     */
    access(key: string): boolean;
    /**
     * Принудительно удаляет URL
     * @param key - Уникальный ключ
     * @returns {boolean}
     *
     * @example
     * urls.revoke("avatar") // true
     */
    revoke(key: string): boolean;
    /**
     * Удаляет все истекшие URL
     * @returns {number} - Количество удаленных URL
     *
     * @example
     * urls.cleanup() // 2
     */
    cleanup(): number;
    /**
     * Создает URL с таймером автоматического удаления
     * @param key - Уникальный ключ
     * @param obj - объект
     * @param ttl - Время жизни в миллисекундах после создания
     * @returns {string} - Созданный URL
     *
     * @example
     * urls.createWithAutoRevoke("preview", blob, 5_000)
     */
    createWithAutoRevoke(key: string, obj: Parameters<typeof URL.createObjectURL>["0"], ttl: number): string;
    /**
     * Проверяет, истек ли срок жизни URL
     * @param {string} url - URL для проверки
     * @returns {boolean} - Истек ли срок
     *
     * @example
     * urls.isExpired("preview") // false
     */
    isExpired(key: string): boolean;
}

/** Parses a Cookie header or document.cookie into a record. @example parseCookies("theme=dark") // { theme: "dark" } */
declare function parseCookies(value?: string): Record<string, string>;

type ColorSchemePreference = "light" | "dark" | "no-preference";
/** Returns the preferred color scheme. @example prefersColorScheme() // "dark" */
declare function prefersColorScheme(): ColorSchemePreference;

/** Checks the user reduced-motion preference. @example prefersReducedMotion() // false */
declare const prefersReducedMotion: () => boolean;

/** Reads a Blob or File as a data URL. @example const source = await readFileAsDataUrl(file) */
declare function readFileAsDataUrl(file: Blob): Promise<string>;

/** Reads a Blob or File as text. @example const text = await readFileAsText(file) */
declare const readFileAsText: (file: Blob) => Promise<string>;

/** Expires a cookie immediately. @example removeCookie("theme") */
declare const removeCookie: (name: string, path?: string) => boolean;

/** Removes a localStorage value and reports whether it succeeded. @example removeStorageItem("theme") // true */
declare function removeStorageItem(key: string): boolean;

/** Scrolls an element into view only when it is outside the viewport. @example scrollIntoViewIfNeeded(errorField) */
declare function scrollIntoViewIfNeeded(element: Element, options?: ScrollIntoViewOptions): boolean;

type CookieOptions = {
    path?: string;
    domain?: string;
    maxAge?: number;
    expires?: Date;
    sameSite?: "lax" | "strict" | "none";
    secure?: boolean;
};
/** Sets a browser cookie and returns whether document.cookie is available. @example setCookie("theme", "dark", { path: "/" }) */
declare function setCookie(name: string, value: string, options?: CookieOptions): boolean;

/** Sets a CSS custom property. @example setCssVariable("--brand-color", "rebeccapurple") */
declare function setCssVariable(name: string, value: string, element?: HTMLElement): boolean;

/** Stores a JSON value in localStorage and reports whether it succeeded. @example setStorageItem("theme", "dark") // true */
declare function setStorageItem(key: string, value: unknown): boolean;

/** Keeps Tab navigation inside a container and returns a cleanup function. @example const release = trapFocus(dialog) */
declare function trapFocus(container: HTMLElement): () => void;

/** Resolves on the next animation frame, with an SSR-safe timer fallback. @example await waitForAnimationFrame() */
declare const waitForAnimationFrame: () => Promise<number>;

/** Resolves when an element transition ends or a timeout is reached. @example await waitForTransition(panel) */
declare function waitForTransition(element: HTMLElement, timeout?: number): Promise<void>;

/**
 * Преобразует трёх- или шестизначный HEX-цвет в кортеж RGB.
 *
 * @example
 * HEXtoRGB("#ff8000") // [255, 128, 0]
 */
declare const HEXtoRGB: (hex: string) => [number, number, number];

/**
 * Преобразует цвет из HSV в RGB.
 *
 * `h`, `s` и `v` должны быть в диапазоне `0..1`.
 *
 * @example
 * HSVtoRGB(0, 1, 1) // [255, 0, 0]
 */
declare const HSVtoRGB: (h: number, s: number, v: number) => [number, number, number];

/**
 * Преобразует RGB-компоненты в HEX-строку.
 *
 * @example
 * RGBtoHEX(255, 128, 0) // "#ff8000"
 */
declare const RGBtoHEX: (r: number, g: number, b: number) => string;

/**
 * Преобразует цвет из RGB в HSV.
 *
 * @example
 * RGBtoHSV(255, 0, 0) // [0, 1, 1]
 */
declare const RGBtoHSV: (r: number, g: number, b: number) => [number, number, number];

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
 * Хранит исходное и текущее значения, позволяя проверить и получить изменения.
 *
 * @example
 * const form = new DataKeeper({ name: "Ann" })
 * form.setter((value) => ({ ...value, name: "Bob" }))
 * form.updateValues // { name: "Bob" }
 */
declare class DataKeeper<VALUE extends unknown> {
    initValue: VALUE;
    currentValue: VALUE;
    /** Создаёт хранилище и сохраняет копию начального значения. */
    constructor(value: VALUE);
    /**
     * Заменяет текущее значение результатом функции обновления.
     *
     * @example
     * form.setter((value) => ({ ...value, name: "Bob" }))
     */
    setter(updater: (value: VALUE) => VALUE): void;
    /**
     * Устанавливает новое исходное и текущее значение.
     *
     * @example
     * form.reset({ name: "Ann" })
     */
    reset(value: VALUE): void;
    /**
     * Проверяет, отличается ли текущее значение от исходного.
     *
     * @example
     * form.isModified() // true
     */
    isModified(): boolean;
    /**
     * Возвращает только изменившуюся часть текущего значения.
     *
     * @example
     * form.updateValues // { name: "Bob" }
     */
    get updateValues(): VALUE | undefined;
}

/**
 * Генерирует уникальный ключ для произвольного JavaScript объекта, используя хеширование (без внешних библиотек).
 *
 * @param {any} obj Произвольный JavaScript объект (string, number, array, object, итд.).
 * @returns {string} Строка, представляющая собой уникальный ключ (хеш) для переданного объекта.
 *
 * @example
 * generateUniqueKey({ page: 1, filter: "new" }) // например, "-5e372bce"
 */
declare const generateUniqueKey: <VALUE extends unknown>(obj: VALUE) => string;

/**
 * Возвращает изменившуюся часть `next` относительно `prev` или `undefined`, если изменений нет.
 *
 * @example
 * getChangedData({ name: "Ann", age: 20 }, { name: "Ann", age: 21 }) // { age: 21 }
 */
declare function getChangedData<VALUE extends unknown>(prev: VALUE, next: VALUE): VALUE | undefined;

type Type = "string" | "number" | "bigint" | "nan" | "boolean" | "object" | "array" | "function" | "null" | "undefined" | "symbol" | "date" | "regexp" | "error" | "unknown" | "map" | "set" | "weakmap" | "weakset" | "promise" | "buffer";
/**
 * Возвращает нормализованное имя типа или проверяет соответствие указанному типу.
 *
 * @example
 * isType({}) // return: "object"
 * isType({}, "object") // return: true
 */
declare function isType<Value>(value: Value, type: Type): boolean;
declare function isType<Value>(value: Value): Type;

/**
 * Функция мемоизации, которая сохраняет результаты вызовов функции `fn` с определенными аргументами.
 * @template F - Параметр типа для функции, которая принимается на вход.
 * @param {F} fn - Функция, результат выполнения которой необходимо запоминать.
 * @returns {F} - Меморизованная версия переданной функции.
 *
 * @example
 * const square = memoize((value: number) => value ** 2)
 * square(4) // 16; следующий вызов с 4 берётся из кеша
 */
declare function memoize<F extends (...args: any[]) => any>(fn: F): F;

/**
 * Создаёт объект без перечисленных ключей.
 *
 * @example
 * omit({ key: "1", id: "2" }, ["key"]) // { id: "2" }
 */
declare function omit<T extends object, K extends keyof T>(object: T, keys: K[]): Omit<T, K>;

/**
 * Создаёт объект только с перечисленными ключами.
 *
 * @example
 * pick({ key: "1", id: "2" }, ["key"]) // return: { key: "1" }
 */
declare function pick<T extends object, K extends keyof T>(object: T, keys: K[]): Pick<T, K>;

/**
 * Разбирает JSON и возвращает fallback вместо исключения при невалидных данных.
 *
 * @example
 * safeJsonParse<{ page: number }>("{\"page\":2}") // { page: 2 }
 * safeJsonParse("invalid", null) // null
 */
declare function safeJsonParse<T>(value: string): T | undefined;
declare function safeJsonParse<T>(value: string, fallback: T): T;

/**
 * Рекурсивно копирует объекты и массивы, а `Map` и `Set` — только на верхнем уровне.
 *
 * @example
 * const copy = unlink({ settings: { theme: "dark" } })
 */
declare const unlink: <VALUE extends unknown>(value: VALUE) => VALUE;

/**
 * Рекурсивно объединяет `current` и `next`, отдавая приоритет уже заданному текущему значению.
 *
 * @example
 * updateCurrent({ page: 1 }, { page: 2, size: 20 }) // { page: 1, size: 20 }
 */
declare function updateCurrent<CURRENT extends unknown, NEXT extends unknown>(current: CURRENT, next: NEXT): CURRENT;

/**
 * Формирует русскоязычное описание времени, прошедшего с Unix timestamp.
 *
 * @example
 * timeAgo(Date.now() - 60_000) // "минуту назад"
 */
declare const timeAgo: (timestamp: number) => string;

type Callback<T extends unknown[] = unknown[]> = (...args: T) => void;
/**
 * Типизированный диспетчер событий с обычными, одноразовыми и отложенными событиями.
 *
 * @example
 * const events = new EventEmitter<{ ready: [id: string] }>()
 * events.on("ready", (id) => console.log(id))
 * events.emit("ready", "42")
 */
declare class EventEmitter<TEvents extends Record<string, unknown[]>> {
    e: Record<string, Callback[]>;
    pendingEvents: Record<string, TEvents[keyof TEvents & string][]>;
    /**
     * Подписка на событие
     * @param name - Имя события
     * @param callback - Функция-обработчик
     * @returns Функция для отписки
     *
     * @example
     * const unsubscribe = events.on("ready", handler)
     */
    on<TEventName extends keyof TEvents & string>(name: TEventName, callback: Callback<TEvents[TEventName]>): () => void;
    /**
     * Отписка от события
     * @param name - Имя события
     * @param callback - Функция-обработчик для удаления
     *
     * @example
     * events.off("ready", handler)
     */
    off<TEventName extends keyof TEvents & string>(name: TEventName, callback: Callback<TEvents[TEventName]>): void;
    /**
     * Инициация события (без отложенной отправки)
     * @param name - Имя события
     * @param args - Аргументы для обработчиков
     *
     * @example
     * events.emit("ready", "42")
     */
    emit<TEventName extends keyof TEvents & string>(name: TEventName, ...args: TEvents[TEventName]): void;
    /**
     * Инициация события с отложенной отправкой (если нет подписчиков - сохраняет в буфер)
     * @param name - Имя события
     * @param args - Аргументы для обработчиков
     *
     * @example
     * events.emitWithDefer("ready", "42")
     */
    emitWithDefer<TEventName extends keyof TEvents & string>(name: TEventName, ...args: TEvents[TEventName]): void;
    /**
     * Подписка на событие один раз
     * @param name - Имя события
     * @param callback - Функция-обработчик
     * @returns Функция для отписки
     *
     * @example
     * events.once("ready", handler)
     */
    once<TEventName extends keyof TEvents & string>(name: TEventName, callback: Callback<TEvents[TEventName]>): () => void;
    /**
     * Полная очистка всех подписчиков
     * @param name - Опциональное имя события (если не указано - очищаем все)
     *
     * @example
     * events.clear("ready")
     */
    clear<TEventName extends keyof TEvents & string>(name?: TEventName): void;
}

/**
 * Округляет положительное число вверх до ближайшего значения, кратного `by`.
 *
 * @example
 * alignTo(1, 4) // return: 4
 * alignTo(3, 4) // return: 4
 * alignTo(5, 4) // return: 8
 * alignTo(9, 4) // return: 12
 */
declare function alignTo(num: number, by: number): number;

/**
 * Ограничивает число нижней и верхней границами включительно.
 *
 * @example
 * clamp(10, 1, 10) // return: 10
 * clamp(0, 1, 10) // return: 1
 * clamp(11, 1, 10) // return: 10
 */
declare const clamp: (value: number, min: number, max: number) => number;

/**
 * Выбирает одну из трёх русских форм слова для числа.
 *
 * @example
 * decWord(22, ["файл", "файла", "файлов"]) // "файла"
 */
declare const decWord: (n: number, words: string[]) => string;

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

/**
 * Форматирует размер в байтах в компактную строку с бинарным суффиксом.
 *
 * @example
 * formatBytes(1536) // "1.5 KB"
 */
declare function formatBytes(bytes: number, fractionDigits?: number): string;

/** Formats a duration for UI. @example formatDuration(90_000) // "1m 30s" */
declare function formatDuration(milliseconds: number): string;

/**
 * Разделяет тысячи точками без изменения дробной части.
 *
 * @example
 * formatNumber(1234567) // "1.234.567"
 */
declare const formatNumber: (number: number) => string;

/**
 * Возвращает целое число из диапазона включительно. При `seed` использует
 * воспроизводимую последовательность псевдослучайных чисел.
 *
 * @example
 * random(1, 6, 42) // число от 1 до 6
 */
declare function random(min: number, max: number, seed?: number): number;

/**
 * Функция для выбора случайного элемента из объекта items на основе весов, с возможностью использования seed для случайности.
 * @template Items
 * @param {Items} items - Объект, представляющий элементы и их веса.
 * @param {number} [seed] - Необязательное значение для начального состояния генерации случайных чисел.
 * @returns {string} Выбор случайного элемента на основе указанных весов.
 *
 * @example
 * randomByWeight({ common: 80, rare: 20 }, 42) // "common" или "rare"
 */
declare function randomByWeight<Items extends Record<string, number>>(items: Items, seed?: number): Extract<keyof Items, string>;

/**
 * Сокращает большое число с помощью суффиксов тысяч, миллионов и далее.
 *
 * @example
 * toShort(1_250) // "1.2k"
 */
declare const toShort: (number: number, customParts?: string[], fixed?: number) => string;

/** Capitalizes the first character of a string. @example capitalize("utils") // "Utils" */
declare const capitalize: (value: string) => string;

/** Escapes text for use inside a regular expression. @example escapeRegExp("a+b") // "a\\+b" */
declare const escapeRegExp: (value: string) => string;

/** Returns a lowercase file extension without a dot. @example getFileExtension("photo.PNG") // "png" */
declare const getFileExtension: (value: string) => string;

/** Removes the final extension from a file name. @example getFileNameWithoutExtension("photo.png") // "photo" */
declare const getFileNameWithoutExtension: (value: string) => string;

/** Performs a lightweight email-address validation. @example isEmail("hi@example.com") // true */
declare const isEmail: (value: string) => boolean;

/** Checks whether a value is an absolute HTTP(S) URL. @example isUrl("https://example.com") // true */
declare const isUrl: (value: string) => boolean;

/**
 * Опции для парсера текста
 */
interface TextParserOptions$1 {
    /**
     * Callback-функция, вызываемая для каждого найденного токена
     * Позволяет модифицировать токены перед добавлением в результат
     */
    onToken?: (token: TextToken$1) => TextToken$1;
    /**
     * Требовать ли наличие протокола (http/https) для распознавания URL
     * @default false
     */
    requireProtocol?: boolean;
    /**
     * Кастомное регулярное выражение для поиска URL
     * Если не указано, используется стандартное выражение
     */
    regex?: RegExp;
}
/**
 * Типы токенов, которые может распознавать парсер
 */
type TextTokenType$1 = "raw" | "url" | "emoji";
/**
 * Токен - минимальная единица разбора текста
 */
interface TextToken$1 {
    /** Тип токена */
    type: TextTokenType$1;
    /** Значение токена */
    value: string;
}
/**
 * Парсит текст на токены: URL, эмодзи и обычный текст
 *
 * @param input - Входная строка для парсинга
 * @param options - Опции парсера
 * @returns Массив токенов
 *
 * @example
 * ```typescript
 * const result = parseTextTokens("Привет! 😊 Посети https://example.com")
 * // [
 * //   { type: "raw", value: "Привет! " },
 * //   { type: "emoji", value: "😊" },
 * //   { type: "raw", value: " Посети " },
 * //   { type: "url", value: "https://example.com" }
 * // ]
 * ```
 */
declare const parseTextTokens: (input: string, options?: TextParserOptions$1) => TextToken$1[];

/**
 * Разбирает semver-подобную строку с допустимыми `*` в компонентах версии.
 *
 * @example
 * parseVersionString("1.2.3-beta") // { major: 1, minor: 2, patch: 3, prerelease: "beta" }
 */
declare function parseVersionString(versionString: string): {
    major: number | "*";
    minor: number | "*";
    patch: number | "*";
    prerelease: string | null;
};

/** Removes HTML tags from a string. @example stripHtml("<b>Hello</b>") // "Hello" */
declare const stripHtml: (value: string) => string;

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
/**
 * Разбирает текст на URL и обычные фрагменты.
 *
 * @deprecated Используйте `parseTextTokens`, который также поддерживает emoji.
 * @example
 * textParserUrl("Сайт example.com") // [{ type: "raw", value: "Сайт " }, { type: "url", value: "example.com" }]
 */
declare const textParserUrl: (input: string, options?: TextParserOptions) => TextToken[];

/** Converts words to camelCase. @example toCamelCase("user profile") // "userProfile" */
declare const toCamelCase: (value: string) => string;

/** Converts words to kebab-case. @example toKebabCase("user profile") // "user-profile" */
declare const toKebabCase: (value: string) => string;

/** Converts words to snake_case. @example toSnakeCase("user profile") // "user_profile" */
declare const toSnakeCase: (value: string) => string;

/** Truncates text without exceeding the requested length. @example truncate("Hello world", 8) // "Hello..." */
declare function truncate(value: string, maxLength: number, suffix?: string): string;

interface UrlRule {
    hosts: (string | RegExp)[];
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
     * Поддерживает как строки, так и регулярные выражения
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

/**
 * Разбирает строку запроса URL и возвращает объект с параметрами запроса.
 * @param {string} queryString - Строка запроса, начинающаяся с '?'.
 * @returns {Record<string, string>} - Объект, представляющий параметры запроса и их значения.
 *
 * @example
 * parseQueryString("?page=2&filter=new") // { page: "2", filter: "new" }
 */
declare function parseQueryString<Result extends Record<string, string>>(queryString: string): Result;

export { type ColorSchemePreference, type CookieOptions, DataKeeper, DebouncedFunction, type ElementOffset, EventEmitter, HEXtoRGB, HSVtoRGB, ObjectURLManager, RGBtoHEX, RGBtoHSV, RequestDeduplicator, type SafeAreaInsets, UrlAction, type UrlRule, UrlSecurityManager, alignTo, capitalize, chunks, clamp, distributor as comparison, copyImageToClipboard, copyText, createAbortTimeout, createLinksFromText, createMediaQuery, debounce, decWord, downloadBlob, elasticClamp, escapeRegExp, focusFirst, focusLast, formatBytes, formatDuration, formatNumber, generateUniqueKey, getChangedData, getCookie, getCssVariable, getDevicePixelRatio, getElementOffset, getFileExtension, getFileNameWithoutExtension, getFocusableElements, getImageDimensions, getSafeAreaInsets, getScrollParent, getScrollbarWidth, getStorageItem, groupBy, isAbortError, isBrowser, isElementVisible, isEmail, isMobileViewport, isTouchDevice, isType, isUrl, memoize, nextFrame, omit, once, orderBy, parseCookies, parseQueryString, parseTextTokens, parseVersionString, pick, prefersColorScheme, prefersReducedMotion, random, randomByWeight, readFileAsDataUrl, readFileAsText, removeCookie, removeStorageItem, retry, safeJsonParse, scrollIntoViewIfNeeded, setCookie, setCssVariable, setStorageItem, shuffle, sleep, stripHtml, textParserUrl, throttle, timeAgo, toCamelCase, toKebabCase, toShort, toSnakeCase, trapFocus, truncate, unique, unlink, updateCurrent, waitForAnimationFrame, waitForTransition, withTimeout };
