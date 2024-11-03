## Utils
[![npm version](https://img.shields.io/npm/v/@minsize/utils)](https://www.npmjs.com/package/@minsize/utils)

```
npm i @minsize/utils

yarn add @minsize/utils
```

### Functions
```js
import { 
    chunks, 
    clamp, 
    decWord, 
    alignTo, 
    toShort, 
    timeAgo, 
    formatNumber, 
    shuffle, 
    random, 
    isType, 
    omit, 
    pick, 
    sleep
} from '@minsize/utils'
```

| Function       | Description                                                                                        |
| -------------- | -------------------------------------------------------------------------------------------------- |
| `chunks`       | Splits an array into pieces of the given size.                                                     |
| `clamp`        | Limits the number to the specified minimum and maximum value.                                      |
| `decWord`      | The function returns a string representing the correct ending of the word depending on the number. |
| `alignTo`      | The function returns an aligned number.                                                            |
| `toShort`      | The function returns a string representing the number in short form.                               |
| `timeAgo`      | The function returns a string describing the time elapsed since timestamp.                         |
| `formatNumber` | Formats a number into a delimited string.                                                          |
| `shuffle`      | Shuffles the elements of an array in random order.                                                 |
| `random`       | Generates a random number within the specified range.                                              |
| `isType`       | Checks if the value is of the specified type.                                                      |
| `omit`         | Returns a new object with no specified keys.                                                       |
| `pick`         | Returns a new object with the selected keys.                                                       |
| `sleep`        | Waits for the specified number of milliseconds.                                                    |

