# Basic Tech Trivia and JavaScript Traps

These are the small, annoying JavaScript facts that show up in timed screens because they are quick to grade and easy to miss.

## Typeof

```js
typeof NaN; // "number"
typeof null; // "object"
typeof []; // "object"
typeof {}; // "object"
typeof (() => {}); // "function"
typeof undefined; // "undefined"
typeof Symbol("id"); // "symbol"
typeof 10n; // "bigint"
```

Key notes:

- `NaN` is a special numeric value, so `typeof NaN` is `"number"`.
- `typeof null === "object"` is a historical JavaScript bug.
- Arrays need `Array.isArray(value)`.

```js
Array.isArray([]); // true
Array.isArray({ length: 0 }); // false
```

## NaN

```js
NaN === NaN; // false
Number.isNaN(NaN); // true
Number.isNaN("hello"); // false
isNaN("hello"); // true, because global isNaN coerces first
Object.is(NaN, NaN); // true
```

Use `Number.isNaN` when you mean "is this value actually NaN?"

## Null and Undefined

```js
null == undefined; // true
null === undefined; // false
typeof undefined; // "undefined"
typeof null; // "object"
```

`value == null` is sometimes intentionally used to match both `null` and `undefined`, but in screening questions assume they are checking whether you know the coercion.

## Truthy and Falsy

Falsy values:

```js
false;
0;
-0;
0n;
"";
null;
undefined;
NaN;
```

Truthy values that look suspicious:

```js
Boolean([]); // true
Boolean({}); // true
Boolean("false"); // true
Boolean("0"); // true
```

## Equality Traps

```js
[] == false; // true
[] === false; // false
[] == true; // false
![]; // false, because [] is truthy
!![]; // true
```

Why `[] == false` is true:

```js
// [] becomes "" when coerced to primitive.
// false becomes 0.
// "" becomes 0.
// 0 == 0.
```

More:

```js
[1] == 1; // true
[1, 2] == "1,2"; // true
[] == ""; // true
[] == 0; // true
"" == 0; // true
"0" == false; // true
0 == false; // true
null == 0; // false
undefined == 0; // false
```

Use `===` unless you have a specific reason not to.

## Object.is

```js
Object.is(NaN, NaN); // true
Object.is(0, -0); // false
0 === -0; // true
NaN === NaN; // false
```

`Object.is` is almost strict equality, except it treats `NaN` as equal to itself and distinguishes `0` from `-0`.

## Scope, Hoisting, and TDZ

```js
console.log(a); // undefined
var a = 1;
```

`var` declarations are hoisted and initialized to `undefined`.

```js
console.log(b); // ReferenceError
let b = 1;
```

`let` and `const` are hoisted too, but they are in the temporal dead zone until the declaration runs.

```js
sayHi(); // "hi"

function sayHi() {
  return "hi";
}
```

Function declarations are hoisted with their function body.

```js
sayBye(); // TypeError: sayBye is not a function

var sayBye = function () {
  return "bye";
};
```

The variable is hoisted, not the function expression assignment.

## Closures

```js
function makeCounter() {
  let count = 0;

  return function increment() {
    count += 1;
    return count;
  };
}

const counter = makeCounter();
counter(); // 1
counter(); // 2
```

A closure is a function plus access to variables from its lexical environment, even after the outer function has finished.

Loop trap:

```js
const fns = [];

for (var i = 0; i < 3; i += 1) {
  fns.push(() => i);
}

fns.map((fn) => fn()); // [3, 3, 3]
```

Fix:

```js
const fns = [];

for (let i = 0; i < 3; i += 1) {
  fns.push(() => i);
}

fns.map((fn) => fn()); // [0, 1, 2]
```

`let` creates a new block-scoped binding per loop iteration.

## This

```js
const user = {
  name: "Mina",
  regular() {
    return this.name;
  },
  arrow: () => this.name,
};

user.regular(); // "Mina"
user.arrow(); // usually undefined in modules
```

Arrow functions do not bind their own `this`; they capture it lexically.

Losing `this`:

```js
const user = {
  name: "Mina",
  getName() {
    return this.name;
  },
};

const getName = user.getName;
getName(); // undefined in strict mode, or global lookup outside strict mode
```

Fix with `bind`:

```js
const boundGetName = user.getName.bind(user);
boundGetName(); // "Mina"
```

## Promises and Event Loop

```js
console.log("A");

setTimeout(() => console.log("B"), 0);

Promise.resolve().then(() => console.log("C"));

console.log("D");
```

Output:

```txt
A
D
C
B
```

Synchronous code runs first. Promise callbacks are microtasks. `setTimeout` callbacks are macrotasks.

## Destructuring

```js
const user = { id: 1, profile: { name: "Ada" } };
const {
  profile: { name },
} = user;

name; // "Ada"
```

Default values apply only when the value is `undefined`, not `null`.

```js
const { count = 10 } = { count: undefined };
count; // 10

const { total = 10 } = { total: null };
total; // null
```

## Spread vs Reference

```js
const original = { nested: { count: 1 } };
const copy = { ...original };

copy.nested.count = 2;
original.nested.count; // 2
```

Object spread is shallow.

## Practice: Predict the Output

1.

```js
console.log(typeof null);
console.log(typeof NaN);
console.log(NaN === NaN);
```

Answer:

```txt
object
number
false
```

2.

```js
console.log([] == false);
console.log(Boolean([]));
console.log([] === false);
```

Answer:

```txt
true
true
false
```

3.

```js
for (var i = 0; i < 2; i += 1) {
  setTimeout(() => console.log(i), 0);
}
```

Answer:

```txt
2
2
```

4.

```js
for (let i = 0; i < 2; i += 1) {
  setTimeout(() => console.log(i), 0);
}
```

Answer:

```txt
0
1
```

5.

```js
console.log("5" - 2);
console.log("5" + 2);
console.log("5" * "2");
```

Answer:

```txt
3
52
10
```

