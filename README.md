# @minsize/utils

Небольшие независимые TypeScript-утилиты для работы с массивами, числами,
данными, текстом, URL и браузерными API. Пакет поставляет типы и поддерживает
ESM и CommonJS.

[![npm version](https://img.shields.io/npm/v/@minsize/utils)](https://www.npmjs.com/package/@minsize/utils)

## Установка

```bash
npm install @minsize/utils
# или
yarn add @minsize/utils
```

## Использование

Все публичные утилиты экспортируются из корня пакета.

```ts
import { clamp, groupBy, parseTextTokens } from "@minsize/utils"

clamp(12, 0, 10) // 10
groupBy(["ant", "bear"], (word) => word.length) // { 3: ["ant"], 4: ["bear"] }
parseTextTokens("Сайт example.com 😊")
```

## API

### Массивы

| Экспорт | Назначение |
| --- | --- |
| `chunks` | Разбивает массив на части заданного размера. |
| `groupBy` | Группирует элементы по значению ключа. |
| `orderBy` | Возвращает отсортированную копию массива по одному или нескольким полям. |
| `shuffle` | Перемешивает элементы массива. Изменяет переданный массив. |
| `unique` | Возвращает массив без повторяющихся значений. |

### Числа и даты

| Экспорт | Назначение |
| --- | --- |
| `alignTo` | Округляет число вверх до кратного. |
| `clamp` | Ограничивает число заданным диапазоном. |
| `decWord` | Выбирает форму слова для числа: один, два–четыре, остальные. |
| `elasticClamp` | Применяет мягкое ограничение со значением за границей. |
| `formatBytes` | Форматирует размер данных в байтах (`1.5 KB`, `2 MB`). |
| `formatNumber` | Разделяет разряды числа точками. |
| `random` | Генерирует целое число в диапазоне включительно. |
| `randomByWeight` | Выбирает ключ объекта согласно его весу. |
| `toShort` | Преобразует большое число в компактную запись (`1.2k`, `3M`). |
| `timeAgo` | Формирует русскоязычную строку прошедшего времени. |

### Данные и объекты

| Экспорт | Назначение |
| --- | --- |
| `comparison` | Глубоко сравнивает поддерживаемые значения. |
| `DataKeeper` | Хранит исходное и текущее значение, а также их различия. |
| `generateUniqueKey` | Строит стабильный хеш для сериализуемого значения. |
| `getChangedData` | Возвращает только отличающуюся часть нового значения. |
| `isType` | Возвращает тип значения или проверяет его соответствие. |
| `memoize` | Кеширует результат функции по сериализованным аргументам. |
| `omit` | Создаёт объект без указанных ключей. |
| `pick` | Создаёт объект только с указанными ключами. |
| `safeJsonParse` | Разбирает JSON и возвращает fallback при ошибке. |
| `unlink` | Клонирует поддерживаемые массивы, объекты, `Map` и `Set`. |
| `updateCurrent` | Рекурсивно объединяет текущее значение с новым. |

### Текст, URL и цвета

| Экспорт | Назначение |
| --- | --- |
| `createLinksFromText` | Заменяет шаблоны `{{key:text}}` результатом callback-функции. |
| `parseTextTokens` | Делит текст на `raw`, `url` и `emoji` токены. |
| `parseVersionString` | Разбирает версию формата `major.minor.patch`. |
| `textParserUrl` | Устаревший URL-парсер; для нового кода используйте `parseTextTokens`. |
| `parseQueryString` | Разбирает строку query-параметров в объект. |
| `UrlSecurityManager`, `UrlAction`, `UrlRule` | Разрешают или описывают проверку URL по приоритетным правилам. |
| `HEXtoRGB`, `RGBtoHEX`, `RGBtoHSV`, `HSVtoRGB` | Преобразуют цвета между HEX, RGB и HSV. |

### Асинхронность, события и браузер

| Экспорт | Назначение |
| --- | --- |
| `sleep` | Создаёт задержку через `Promise`. |
| `retry` | Повторяет асинхронную операцию после ошибки. |
| `debounce` | Откладывает вызов до завершения паузы. |
| `throttle` | Ограничивает частоту вызовов и сохраняет последний вызов. |
| `DebouncedFunction` | Откладывает вызов и объединяет новые аргументы. |
| `RequestDeduplicator` | Объединяет одновременные запросы с одинаковым ключом. |
| `EventEmitter` | Типизированный диспетчер событий. |
| `copyText` | Копирует текст в буфер обмена в среде браузера. |
| `getFocusableElements` | Находит доступные для фокуса элементы контейнера. |
| `isBrowser` | Безопасно проверяет наличие DOM API для SSR. |
| `ObjectURLManager` | Создаёт и освобождает URL для `Blob`/`File`. |

`copyText` и `ObjectURLManager` требуют браузерных API. `textParserUrl` сохранён
для обратной совместимости и помечен как устаревший.

### Дополнительные frontend-хелперы

- Async: `createAbortTimeout`, `isAbortError`, `withTimeout`.
- Browser и DOM: `createMediaQuery`, `getCssVariable`, `getDevicePixelRatio`,
  `getElementOffset`, `getSafeAreaInsets`, `getScrollParent`,
  `getScrollbarWidth`, `isElementVisible`, `isMobileViewport`, `isTouchDevice`,
  `nextFrame`, `prefersColorScheme`, `prefersReducedMotion`,
  `scrollIntoViewIfNeeded`, `setCssVariable`, `waitForAnimationFrame`,
  `waitForTransition`.
- Focus: `focusFirst`, `focusLast`, `trapFocus`.
- Storage и cookies: `getStorageItem`, `setStorageItem`, `removeStorageItem`,
  `getCookie`, `setCookie`, `removeCookie`, `parseCookies`.
- Files и clipboard: `copyImageToClipboard`, `downloadBlob`,
  `getImageDimensions`, `readFileAsDataUrl`, `readFileAsText`.
- Text: `capitalize`, `escapeRegExp`, `getFileExtension`,
  `getFileNameWithoutExtension`, `isEmail`, `isUrl`, `stripHtml`,
  `toCamelCase`, `toKebabCase`, `toSnakeCase`, `truncate`.
- Numbers: `formatDuration`.

Все browser-хелперы, для которых это применимо, безопасно возвращают fallback
в SSR-среде без DOM API.

## Лицензия

[MIT](LICENSE). Можно использовать, копировать, изменять, публиковать и
распространять код, сохранив текст лицензии.
