# Outlier JavaScript Speed Drills

Public candidate reports suggest Outlier's JavaScript screening can be fast-paced and may include multiple choice, written responses, and video/audio explanation. Use these drills to practice short answers under time pressure.

Suggested timing:

- Predict-output questions: 20-45 seconds each.
- Explanation prompts: 45-60 seconds each.
- Small coding prompts: 3-6 minutes each.

## 30-Second Explanation Prompts

Answer these out loud.

### 1. What is a closure?

Good answer:

A closure is when a function keeps access to variables from its lexical scope after the outer function has returned. For example, a counter function can remember its private `count` variable between calls.

```js
function makeCounter() {
  let count = 0;
  return () => {
    count += 1;
    return count;
  };
}
```

### 2. What is hoisting?

Good answer:

Hoisting is JavaScript's compile-time behavior where declarations are registered before code runs. `var` is hoisted and initialized to `undefined`, function declarations are hoisted with their body, and `let`/`const` are hoisted but inaccessible during the temporal dead zone.

### 3. What is the difference between `==` and `===`?

Good answer:

`===` compares without type coercion. `==` may convert operands first, which creates traps like `[] == false` being true. In real code, prefer `===` unless intentionally checking something like `value == null` for both `null` and `undefined`.

### 4. What does `async`/`await` do?

Good answer:

`async` functions always return a promise. `await` pauses execution inside that async function until the promise settles, then resumes on the microtask queue. It makes promise code read like synchronous code, but it is still asynchronous.

### 5. What is the event loop?

Good answer:

The event loop coordinates synchronous call-stack work, microtasks like promise callbacks, and macrotasks like timers. Synchronous code runs first, then queued microtasks, then timer or IO callbacks.

## Predict the Output

### 1.

```js
console.log(typeof NaN);
console.log(Number.isNaN(NaN));
console.log(NaN === NaN);
```

Answer:

```txt
number
true
false
```

### 2.

```js
console.log([] == false);
console.log([] === false);
console.log(Boolean([]));
```

Answer:

```txt
true
false
true
```

### 3.

```js
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");
```

Answer:

```txt
A
D
C
B
```

### 4.

```js
function test() {
  console.log(a);
  var a = 10;
}

test();
```

Answer:

```txt
undefined
```

### 5.

```js
function test() {
  console.log(a);
  let a = 10;
}

test();
```

Answer:

```txt
ReferenceError
```

### 6.

```js
const user = {
  name: "Ada",
  getName() {
    return this.name;
  },
};

const fn = user.getName;
console.log(fn());
```

Answer:

```txt
undefined
```

In strict-mode/module code, `this` is `undefined` for the detached function call. In sloppy script mode, it may look at the global object.

### 7.

```js
console.log([10, 2, 1].sort());
```

Answer:

```txt
[1, 10, 2]
```

Default `sort` compares strings.

### 8.

```js
console.log([NaN].includes(NaN));
console.log([NaN].indexOf(NaN));
```

Answer:

```txt
true
-1
```

### 9.

```js
const nested = [1, [2, [3]]];
console.log(nested.flat());
console.log(nested.flat(2));
```

Answer:

```txt
[1, 2, [3]]
[1, 2, 3]
```

### 10.

```js
console.log([].every(Boolean));
console.log([].some(Boolean));
```

Answer:

```txt
true
false
```

## Small Coding Drills

### 1. Implement `groupBy`

Prompt:

Write a function that groups items by a key returned from a callback.

```js
function groupBy(items, getKey) {
  return items.reduce((acc, item) => {
    const key = getKey(item);
    const group = acc[key] ?? [];
    return {
      ...acc,
      [key]: [...group, item],
    };
  }, {});
}

const result = groupBy(
  [
    { type: "fruit", name: "apple" },
    { type: "veg", name: "carrot" },
    { type: "fruit", name: "banana" },
  ],
  (item) => item.type,
);

console.log(result.fruit.map((item) => item.name)); // ["apple", "banana"]
```

What to explain:

- `reduce` accumulates an object.
- Each key points to an array of matching items.
- The implementation shown avoids mutating the accumulator.

### 2. Implement `unique`

Prompt:

Remove duplicate primitive values while preserving order.

```js
function unique(items) {
  return [...new Set(items)];
}

unique(["a", "b", "a"]); // ["a", "b"]
```

Follow-up:

For objects, `Set` compares references, not deep value equality.

```js
const a = { id: 1 };
const b = { id: 1 };
unique([a, b]); // both remain
```

### 3. Implement `chunk`

Prompt:

Split an array into arrays of a given size.

```js
function chunk(items, size) {
  if (!Number.isInteger(size) || size <= 0) {
    throw new Error("size must be a positive integer");
  }

  const chunks = [];

  for (let index = 0; index < items.length; index += size) {
    chunks.push(items.slice(index, index + size));
  }

  return chunks;
}

chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
```

What to explain:

- `slice` is non-mutating.
- The end index is exclusive.
- Validate `size` to avoid infinite loops.

### 4. Implement `debounce`

Prompt:

Return a function that delays calling `fn` until no calls happen for `delayMs`.

```js
function debounce(fn, delayMs) {
  let timerId;

  return function debounced(...args) {
    clearTimeout(timerId);

    timerId = setTimeout(() => {
      fn.apply(this, args);
    }, delayMs);
  };
}
```

What to explain:

- The returned function closes over `timerId`.
- Each call cancels the previous timer.
- `fn.apply(this, args)` preserves the caller's `this` and arguments.

### 5. Implement a Safe Property Reader

Prompt:

Read a nested value without throwing.

```js
function getUserCity(user) {
  return user?.profile?.address?.city ?? "Unknown";
}
```

What to explain:

- Optional chaining stops if an intermediate value is `null` or `undefined`.
- Nullish coalescing uses the fallback only for `null` or `undefined`, not for `""`, `0`, or `false`.

## Multiple Choice Style Mini-Quiz

1. Which method mutates the original array?

Answer: `sort`, `reverse`, `splice`, `push`, `pop`, `shift`, `unshift`.

2. What does `reduce` return?

Answer: Whatever the accumulator becomes. It is not necessarily an array.

3. What is the result of `typeof []`?

Answer: `"object"`.

4. What is the safest common way to check if a value is an array?

Answer: `Array.isArray(value)`.

5. What is the result of `Promise.resolve().then(...)` relative to `setTimeout(..., 0)`?

Answer: The promise callback runs first after synchronous code, because it is a microtask.

6. Why does `let` fix the closure loop problem?

Answer: `let` creates a new block-scoped binding for each loop iteration.

7. What is the default depth of `flat()`?

Answer: `1`.

8. What is the difference between `||` and `??`?

Answer: `||` falls back on any falsy value. `??` falls back only on `null` or `undefined`.

```js
0 || 10; // 10
0 ?? 10; // 0
```

