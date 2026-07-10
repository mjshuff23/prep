// Map, Set, WeakMap, WeakSet — javascript.info 5.7, 5.8
// Run: node map-set.js

// ── Map vs plain object: any key type, no prototype pollution, ordered, sized ──
const map = new Map();
const objKey = { name: "John" };
map.set(objKey, 123); // objects as keys — plain objects would stringify to "[object Object]"
map.set(1, "num").set("1", "str"); // set chains; 1 and "1" are DIFFERENT keys (no coercion)
console.log(map.get(1), map.get("1")); // num str
console.log(map.get(objKey)); // 123
console.log(map.size); // 3 — objects need Object.keys(o).length

// The object-as-dictionary trap Map avoids:
const dict = {};
console.log("toString" in dict); // true — inherited junk pollutes lookups
console.log(map.has("toString")); // false — Map has no inherited keys

// ── Key equality is SameValueZero: like ===, but NaN equals NaN ──
map.set(NaN, "found me");
console.log(map.get(NaN)); // found me

// ── Iteration: insertion order, entries by default ──
const prices = new Map([
  ["apple", 1],
  ["banana", 2],
]);
for (const [k, v] of prices) console.log(k, v); // apple 1 / banana 2
console.log([...prices.keys()]); // [ 'apple', 'banana' ]
console.log(Object.fromEntries(prices)); // { apple: 1, banana: 2 } — Map → object
console.log(new Map(Object.entries({ a: 1 }))); // object → Map

// ── Set: unique values, same SameValueZero equality ──
const set = new Set([1, 2, 2, 3, 3, 3]);
console.log([...set]); // [ 1, 2, 3 ]
console.log(set.has(2)); // true — O(1), vs array includes O(n)
const uniqueWords = (s) => [...new Set(s.split(" "))];
console.log(uniqueWords("to be or not to be")); // [ 'to', 'be', 'or', 'not' ]

// Objects dedupe by REFERENCE — two equal-looking objects both stay:
console.log(new Set([{ a: 1 }, { a: 1 }]).size); // 2

// ES2025 set ops (Node 22+): union/intersection/difference
console.log([...new Set([1, 2, 3]).intersection(new Set([2, 3, 4]))]); // [ 2, 3 ]

// ── WeakMap/WeakSet: keys don't prevent garbage collection ──
// Use case: attach metadata to objects you don't own, without leaking them.
const visits = new WeakMap();
let user = { name: "Ann" };
visits.set(user, 5);
console.log(visits.get(user)); // 5
user = null; // the { name:"Ann" } object is now unreachable →
// the WeakMap entry is collected WITH it. A normal Map would leak it forever.

// The price of weakness: no iteration, no size, no clear —
// because GC timing is unobservable, the contents are officially unknowable.
console.log(typeof visits.size, visits[Symbol.iterator]); // undefined undefined

// Keys must be objects (or non-registered symbols):
try {
  new WeakMap().set("str", 1);
} catch (e) {
  console.log(e.constructor.name); // TypeError
}
