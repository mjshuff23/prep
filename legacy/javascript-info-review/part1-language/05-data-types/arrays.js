// Arrays + Array methods — javascript.info 5.4, 5.5
// Run: node arrays.js

// ── Arrays are objects with numeric keys + a magic length ──
const arr = [1, 2, 3];
arr.length = 2; // length is WRITABLE — truncates!
console.log(arr); // [ 1, 2 ]
arr[5] = 9; // sparse array: holes, not zeros
console.log(arr, arr.length); // [ 1, 2, <3 empty items>, 9 ] 6

// ── Mutating vs non-mutating: the table you must know cold ──
// MUTATE: push/pop/shift/unshift/splice/sort/reverse/fill/copyWithin
// RETURN NEW: slice/concat/map/filter/flat/flatMap/toSorted/toReversed/toSpliced/with
const base = [3, 1, 2];
const sorted = base.toSorted(); // ES2023: immutable sort
console.log(base, sorted); // [ 3, 1, 2 ] [ 1, 2, 3 ]
console.log(base.with(0, 99)); // [ 99, 1, 2 ] — immutable index write
console.log(base); // [ 3, 1, 2 ] — untouched

// ── THE sort gotcha: default sort is LEXICOGRAPHIC ──
console.log([1, 30, 4, 21].sort()); // [ 1, 21, 30, 4 ] (!)
console.log([1, 30, 4, 21].sort((a, b) => a - b)); // [ 1, 4, 21, 30 ]
// comparator: negative → a first, positive → b first, 0 → keep (stable since ES2019)

// ── splice: the swiss army knife (and its off-by-one traps) ──
const s = ["a", "b", "c", "d"];
const removed = s.splice(1, 2, "X"); // from idx 1, delete 2, insert "X"
console.log(s, removed); // [ 'a', 'X', 'd' ] [ 'b', 'c' ]

// ── delete leaves a hole; splice/filter is the real removal ──
const d = [1, 2, 3];
delete d[1];
console.log(d, d.length); // [ 1, <1 empty item>, 3 ] 3 — length unchanged!

// ── Search: indexOf uses ===, so NaN is findable only by includes ──
console.log([NaN].indexOf(NaN)); // -1
console.log([NaN].includes(NaN)); // true
console.log([{ id: 1 }].indexOf({ id: 1 })); // -1 — reference equality
console.log([{ id: 1 }].findIndex((o) => o.id === 1)); // 0 — predicate search

// ── map/filter/reduce — reduce's initial value matters ──
console.log([1, 2, 3, 4].reduce((acc, x) => acc + x, 0)); // 10
try {
  [].reduce((a, x) => a + x); // no initial value + empty array
} catch (e) {
  console.log(e.constructor.name); // TypeError — always pass the seed
}

// ── The map(parseInt) classic ──
console.log(["1", "7", "11"].map(parseInt)); // [ 1, NaN, 3 ]
// map passes (value, index, array); parseInt takes (string, radix)
// → parseInt("7", 1) = NaN, parseInt("11", 2) = 3
console.log(["1", "7", "11"].map(Number)); // [ 1, 7, 11 ] — fix

// ── Array-ness checks and comparisons ──
console.log(typeof []); // object — useless
console.log(Array.isArray([])); // true — the real check
console.log([] == [], [1] == "1"); // false true — never compare arrays with ==

// ── flat / flatMap ──
console.log([1, [2, [3, [4]]]].flat(Infinity)); // [ 1, 2, 3, 4 ]
console.log([1, 2, 3].flatMap((x) => [x, x * 10])); // [ 1, 10, 2, 20, 3, 30 ]

// ── Array.from: array-likes and iterables → real arrays ──
console.log(Array.from({ length: 3 }, (_, i) => i * 2)); // [ 0, 2, 4 ]
console.log(Array.from("𝒳y").length); // 2 — code-point aware, unlike "𝒳y".length (3)
