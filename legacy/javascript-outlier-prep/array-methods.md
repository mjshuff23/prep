# Array Methods for JavaScript Skill Screens

Array questions often test three things:

- Do you know whether the method mutates the original array?
- Do you know the callback arguments and return value?
- Can you handle empty arrays, sparse arrays, nested arrays, and object references?

## Fast Reference

| Method | Returns | Mutates? | Common Trap |
| --- | --- | --- | --- |
| `push` | new length | yes | Not the array |
| `pop` | removed item | yes | `undefined` on empty array |
| `shift` | removed item | yes | Re-indexes the array |
| `unshift` | new length | yes | Re-indexes the array |
| `slice` | copied section | no | End index is exclusive |
| `splice` | removed items | yes | Can remove and insert |
| `toSpliced` | new changed array | no | Newer non-mutating version |
| `sort` | same array | yes | Sorts strings by default |
| `toSorted` | new sorted array | no | Newer non-mutating version |
| `reverse` | same array | yes | Mutates |
| `toReversed` | new reversed array | no | Newer non-mutating version |
| `map` | new array | no | Callback return matters |
| `filter` | new array | no | Keeps truthy callback results |
| `reduce` | any accumulated value | no | Empty array without initial value throws |
| `flat` | flattened array | no | Default depth is `1` |
| `flatMap` | mapped then flattened one level | no | Only flattens one level |
| `find` | first matching item | no | Returns item, not index |
| `findIndex` | first matching index | no | Returns `-1` if missing |
| `some` | boolean | no | Stops at first true |
| `every` | boolean | no | Stops at first false |
| `includes` | boolean | no | Finds `NaN` |
| `indexOf` | index | no | Does not find `NaN` |
| `at` | item | no | Negative indexes allowed |
| `join` | string | no | `null` and `undefined` become empty strings |

## Mutating vs Non-Mutating

Mutating:

```js
const nums = [3, 1, 2];
const result = nums.sort();

result; // [1, 2, 3]
nums; // [1, 2, 3]
result === nums; // true
```

Non-mutating:

```js
const nums = [3, 1, 2];
const sorted = nums.toSorted((a, b) => a - b);

sorted; // [1, 2, 3]
nums; // [3, 1, 2]
```

If `toSorted`, `toReversed`, or `toSpliced` are not available in the environment, use spread first:

```js
const sorted = [...nums].sort((a, b) => a - b);
```

## Sort

Default `sort` converts values to strings.

```js
[10, 2, 1].sort(); // [1, 10, 2]
```

Numeric ascending:

```js
[10, 2, 1].sort((a, b) => a - b); // [1, 2, 10]
```

Numeric descending:

```js
[10, 2, 1].sort((a, b) => b - a); // [10, 2, 1]
```

Object sorting:

```js
const users = [
  { name: "Ari", score: 20 },
  { name: "Bo", score: 10 },
];

users.toSorted((a, b) => b.score - a.score);
// [{ name: "Ari", score: 20 }, { name: "Bo", score: 10 }]
```

## Map

Use `map` when every input item becomes one output item.

```js
const prices = [10, 20, 30];
const withTax = prices.map((price) => price * 1.08);

withTax; // [10.8, 21.6, 32.4]
```

Callback arguments:

```js
array.map((item, index, originalArray) => {
  return item;
});
```

Trap:

```js
const nums = [1, 2, 3];
const result = nums.map((num) => {
  num * 2;
});

result; // [undefined, undefined, undefined]
```

Block-bodied arrow functions need `return`.

## Filter

Use `filter` when you keep or remove items.

```js
const nums = [1, 2, 3, 4];
const evens = nums.filter((num) => num % 2 === 0);

evens; // [2, 4]
```

Remove falsy values:

```js
[0, 1, false, 2, "", 3, null].filter(Boolean); // [1, 2, 3]
```

Careful: this also removes valid values like `0` and `""`.

## Reduce

Use `reduce` when the output is a single accumulated value: number, object, array, map, string, etc.

Basic sum:

```js
const total = [1, 2, 3].reduce((acc, num) => acc + num, 0);

total; // 6
```

Callback arguments:

```js
array.reduce((accumulator, item, index, originalArray) => {
  return accumulator;
}, initialValue);
```

Empty array trap:

```js
[].reduce((acc, num) => acc + num); // TypeError
[].reduce((acc, num) => acc + num, 0); // 0
```

Always use an initial value unless you have a specific reason not to.

Group by:

```js
const orders = [
  { status: "open", id: 1 },
  { status: "closed", id: 2 },
  { status: "open", id: 3 },
];

const grouped = orders.reduce((acc, order) => {
  const existing = acc[order.status] ?? [];
  return {
    ...acc,
    [order.status]: [...existing, order],
  };
}, {});

grouped.open.map((order) => order.id); // [1, 3]
```

Frequency count:

```js
const counts = ["a", "b", "a"].reduce((acc, letter) => {
  return {
    ...acc,
    [letter]: (acc[letter] ?? 0) + 1,
  };
}, {});

counts; // { a: 2, b: 1 }
```

Flatten one level with reduce:

```js
const nested = [[1, 2], [3], [4, 5]];
const flat = nested.reduce((acc, nums) => [...acc, ...nums], []);

flat; // [1, 2, 3, 4, 5]
```

Find max:

```js
const max = [4, 9, 2].reduce((currentMax, num) => {
  return Math.max(currentMax, num);
}, -Infinity);

max; // 9
```

## Flat

`flat` removes nesting up to a depth.

```js
[1, [2, [3]]].flat(); // [1, 2, [3]]
[1, [2, [3]]].flat(2); // [1, 2, 3]
[1, [2, [3]]].flat(Infinity); // [1, 2, 3]
```

Sparse array trap:

```js
const sparse = [1, , 3];
sparse.length; // 3
sparse.flat(); // [1, 3]
```

`flat` removes empty slots.

## FlatMap

`flatMap` is `map` followed by `flat(1)`.

```js
const words = ["hi there", "bye now"];
const tokens = words.flatMap((phrase) => phrase.split(" "));

tokens; // ["hi", "there", "bye", "now"]
```

Use it to return zero, one, or many values per input item:

```js
const nums = [1, 2, 3, 4];
const oddsDoubled = nums.flatMap((num) => {
  if (num % 2 === 0) return [];
  return [num, num * 2];
});

oddsDoubled; // [1, 2, 3, 6]
```

Only one level:

```js
[1, 2].flatMap((num) => [[num * 2]]);
// [[2], [4]]
```

## Find, FindIndex, Some, Every

```js
const users = [
  { id: 1, active: false },
  { id: 2, active: true },
];

users.find((user) => user.active); // { id: 2, active: true }
users.findIndex((user) => user.active); // 1
users.some((user) => user.active); // true
users.every((user) => user.active); // false
```

Empty array behavior:

```js
[].some(Boolean); // false
[].every(Boolean); // true
```

`every` is vacuously true on an empty array.

## Includes vs IndexOf

```js
[NaN].includes(NaN); // true
[NaN].indexOf(NaN); // -1
```

Use `includes` when checking membership.

## At

```js
const letters = ["a", "b", "c"];

letters.at(0); // "a"
letters.at(-1); // "c"
letters[letters.length - 1]; // "c"
letters[-1]; // undefined
```

## Slice vs Splice

`slice` copies:

```js
const nums = [1, 2, 3, 4];
const middle = nums.slice(1, 3);

middle; // [2, 3]
nums; // [1, 2, 3, 4]
```

`splice` mutates:

```js
const nums = [1, 2, 3, 4];
const removed = nums.splice(1, 2, "x", "y");

removed; // [2, 3]
nums; // [1, "x", "y", 4]
```

## Join

```js
["a", "b", "c"].join("-"); // "a-b-c"
[1, null, undefined, 4].join("|"); // "1|||4"
```

`null` and `undefined` become empty strings in `join`.

## Chaining

```js
const result = [
  { name: "Ada", score: 90 },
  { name: "Lin", score: 70 },
  { name: "Bo", score: 95 },
]
  .filter((student) => student.score >= 80)
  .map((student) => student.name)
  .toSorted();

result; // ["Ada", "Bo"]
```

Chaining is fine when each step has a clear purpose. In an assessment, explain the pipeline one method at a time.

## Practice Problems

1. Convert `["a b", "c d"]` into `["a", "b", "c", "d"]`.

Answer:

```js
["a b", "c d"].flatMap((phrase) => phrase.split(" "));
```

2. Count tags.

```js
const tags = ["js", "react", "js", "css"];
```

Answer:

```js
tags.reduce((acc, tag) => {
  return {
    ...acc,
    [tag]: (acc[tag] ?? 0) + 1,
  };
}, {});
// { js: 2, react: 1, css: 1 }
```

3. Get the last item without mutating.

Answer:

```js
items.at(-1);
```

4. Sort numbers ascending without mutating.

Answer:

```js
const sorted = nums.toSorted((a, b) => a - b);
// or:
const sortedFallback = [...nums].sort((a, b) => a - b);
```

5. Explain the output.

```js
const nums = [1, 2, 3];
console.log(nums.map((num) => {
  num * 2;
}));
```

Answer:

```txt
[undefined, undefined, undefined]
```

The callback uses a block body without `return`.

