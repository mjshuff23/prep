# 05 — Data types

Files: `primitives-strings` · `numbers` · `arrays` · `iterables` · `map-set` · `object-keys-destructuring` · `date-json` (each in `.js` and `.ts`)

## Primitives with methods: the wrapper illusion

`"hi".toUpperCase()` works because the engine creates a **temporary wrapper object**
around the primitive, calls the method, and throws the wrapper away. The primitive
itself never changes and can't hold state (writing a property on it throws in strict
mode). Never use `new String()`/`new Number()` — they create real objects that break
`===` and truthiness (`new Boolean(false)` is truthy!). TypeScript makes the wrappers a
type error (`String` ≠ `string`), closing the trap.

## Numbers: one type, IEEE-754 double

Every JS number is a 64-bit float. Two consequences dominate:

1. **Integers are exact only up to 2⁵³−1** (`Number.MAX_SAFE_INTEGER`). Beyond that,
   distinct integers compare equal. Big IDs from APIs must travel as strings or BigInt.
2. **Decimal fractions don't exist in binary.** `0.1 + 0.2 !== 0.3` isn't a bug, it's
   base-2. Compare with an epsilon, round for display, and store money as integer
   cents. `toFixed` rounds the *stored* binary value (`(6.35).toFixed(1)` → `"6.3"`)
   and returns a **string**.

`NaN` is the only self-unequal value; use `Number.isNaN` (the global `isNaN` coerces —
`isNaN("foo")` is `true`). `+""` is `0`. Always pass a radix to `parseInt`.

## Arrays: ordered data, plus 30 methods

The two-column table worth memorizing — **mutators**: `push pop shift unshift splice
sort reverse fill` vs **immutable returns**: `slice concat map filter flat` and the
ES2023 four `toSorted toReversed toSpliced with`. Interview classics: default `.sort()`
is lexicographic (`[1,30,4]` → `[1,21,30,4]`-style surprises); `map(parseInt)` feeds the
index as radix; `delete arr[i]` leaves a hole; `indexOf` can't find `NaN` but
`includes` can; `length` is writable and truncates.

Iteration protocol (`Symbol.iterator`) is what `for..of`, spread, destructuring, and
`Array.from` all speak. **Iterable** (has the symbol) ≠ **array-like** (has indexes +
`length`); `Array.from` accepts both. `for..in` walks enumerable keys including
inherited ones — for objects only, never arrays.

## Map/Set vs plain objects

Use `Map` when keys are dynamic or non-strings: no prototype pollution (`"toString" in
{}` is `true`!), any key type, insertion-order iteration, `size`, O(1) `has`. Key
equality is *SameValueZero* — `===` plus `NaN === NaN`. `Set` = value-uniqueness with
the same equality, hence `new Set([{a:1},{a:1}])` keeps both (references differ).

**Weak** collections hold keys *without keeping them alive*: when the last other
reference to a key object disappears, the entry evaporates. That's the tool for caches
and metadata attached to objects you don't own. The trade: not iterable, no `size` —
GC timing must stay unobservable. TS adds `Map<K,V>` generics and the honest
`V | undefined` from `.get()`; note `has()` does **not** narrow a later `get()`.

## Destructuring

Arrays match by *position* (works on any iterable), objects by *name*. The full grammar
in one line each:

```js
const [a = 1, , ...rest] = iterable;              // default, skip, rest
const { prop: renamed = defaultVal, ...rest } = obj;
```

Nested patterns declare only the *leaves*. Destructuring `null`/`undefined` throws —
which is why the named-parameters idiom ends with `= {}`:
`function f({ x = 1, y = 2 } = {}) {}`. TS threads inference through all of it and the
rename syntax (`prop: newName`) is famously confusable with a type annotation — a type
goes after the *whole pattern*.

## Date & JSON: the two lossy boundaries

**Date** is a UTC timestamp with local getters. Months are 0-indexed; `getDay()` is
weekday, `getDate()` is day-of-month. Out-of-range components *roll over* — great for
"+70 days" math, dangerous for `setMonth` on the 31st. Only ISO 8601 parsing is
portable, and date-only strings parse as UTC while date-time strings parse as *local*.

**JSON.stringify** silently drops functions, `undefined`, and symbols; turns `NaN`/
`Infinity` into `null`; serializes `Map`/`Set` as `{}`; and converts `Date` to an ISO
string that **does not come back** as a Date on parse. `JSON.parse` returns `any` in
TS — the biggest type-safety hole in typical codebases. Treat parse results as
`unknown` and validate (by hand or with zod-style schemas), and model wire types where
`Date` is `string`.

## Gotcha checklist

- [ ] `0.1 + 0.2 !== 0.3`; `toFixed` returns a string and can round "wrong"
- [ ] `isNaN` coerces, `Number.isNaN` doesn't; `NaN !== NaN`
- [ ] `.sort()` without comparator sorts as strings — always `(a,b) => a-b`
- [ ] `map(parseInt)` → radix bug; use `map(Number)`
- [ ] Integer-like object keys iterate in ascending order, not insertion order
- [ ] `Map.get` misses are `undefined`; object dicts inherit `toString` etc.
- [ ] Weak collections: no iteration/size by design
- [ ] `substring` swaps reversed args; `slice` supports negatives
- [ ] `"𝒳".length === 2` — code units, not characters
- [ ] Months 0-indexed; `getDay` vs `getDate`; `setMonth` rollover
- [ ] JSON drops `undefined`/functions/symbols and flattens Maps to `{}`

## Predict the output

```js
// 1
console.log([10, 1, 3].sort().at(-1));

// 2
const m = new Map([[1, "a"]]);
m.set("1", "b");
console.log(m.size, m.get(1), m.get("1"));

// 3
const arr = [1, 2, 3];
delete arr[1];
console.log(arr.length, arr.filter(Boolean).length);

// 4
const { a, b = a + 1, ...rest } = { a: 1, c: 3, d: 4 };
console.log(a, b, rest);

// 5
console.log(JSON.stringify({ x: undefined, y: NaN, z: [undefined] }));

// 6
console.log((0.1 * 3).toFixed(1) === "0.3", 0.1 * 3 === 0.3);
```

<details>
<summary>Answers</summary>

1. `3` — `.sort()` is lexicographic: `[1, 10, 3]` (as strings `"1" < "10" < "3"`), so
   `.at(-1)` is `3`, not `10`.
2. `2 "a" "b"` — Map does no key coercion; `1` and `"1"` are separate keys.
3. `3 2` — `delete` leaves a hole (length unchanged); `filter` skips holes, keeping `[1,3]`.
4. `1 2 { c: 3, d: 4 }` — defaults can reference earlier bindings; rest collects the rest.
5. `{"y":null,"z":[null]}` — `undefined` props vanish, but in ARRAYS it becomes `null`;
   `NaN` → `null`.
6. `true false` — `0.1*3` is `0.30000000000000004`; `toFixed(1)` rounds the string to
   `"0.3"` but the number itself never equals `0.3`.

</details>
