// Object.keys/values/entries + Destructuring — javascript.info 5.9, 5.10
// Run: node object-keys-destructuring.js

// ── keys/values/entries — own, enumerable, STRING keys only ──
const user = { name: "John", age: 30, [Symbol("id")]: 1 };
console.log(Object.keys(user)); // [ 'name', 'age' ] — symbol skipped
console.log(Object.values(user)); // [ 'John', 30 ]
console.log(Object.entries(user)); // [ [ 'name', 'John' ], [ 'age', 30 ] ]

// Transform an object by round-tripping through entries:
const prices = { banana: 1, orange: 2, meat: 4 };
const doubled = Object.fromEntries(Object.entries(prices).map(([k, v]) => [k, v * 2]));
console.log(doubled); // { banana: 2, orange: 4, meat: 8 }

// ── Integer-like keys are SORTED, others keep insertion order ──
const codes = { 49: "de", 41: "ch", 44: "gb", plus: "!" };
console.log(Object.keys(codes)); // [ '41', '44', '49', 'plus' ] — the phone-code gotcha

// ── Array destructuring ──
const [first, , third = "z"] = ["a", "b"]; // skip with holes; defaults for missing
console.log(first, third); // a z
let a = 1, b = 2;
[a, b] = [b, a]; // the swap idiom
console.log(a, b); // 2 1
const [head, ...tail] = [1, 2, 3, 4];
console.log(head, tail); // 1 [ 2, 3, 4 ]
// Works with ANY iterable, and targets can be object properties:
const pos = {};
[pos.x, pos.y] = "07"; // strings are iterable
console.log(pos); // { x: '0', y: '7' }

// ── Object destructuring: match by NAME, rename with :, default with = ──
const options = { title: "Menu", height: 200 };
const { title, width: w = 100, height: h } = options;
console.log(title, w, h); // Menu 100 200

// Gotcha: a bare destructuring statement needs parens — {} parses as a block:
let t2;
({ title: t2 } = options);
console.log(t2); // Menu

// ── Nested + rest ──
const cfg = { size: { w: 100, h: 200 }, items: ["Cake", "Donut"], extra: true };
const {
  size: { w: width, h: height }, // NOTE: `size` itself is NOT declared, only leaves
  items: [item1],
  ...rest
} = cfg;
console.log(width, height, item1, rest); // 100 200 Cake { extra: true }

// ── The killer use case: named function parameters ──
function showMenu({ title = "Untitled", width = 200, items = [] } = {}) {
  //                                                            ^^^^ = {} lets you call with NO args
  console.log(`${title} ${width} [${items}]`);
}
showMenu({ items: ["a", "b"], title: "My menu" }); // My menu 200 [a,b]
showMenu(); // Untitled 200 []

// ── Destructuring null/undefined throws ──
try {
  const { x } = null;
} catch (e) {
  console.log(e.constructor.name); // TypeError — hence the `= {}` defaults above
}
