// Object references and copying — javascript.info 4.2
// Run: node object-references.js

// ── Primitives copy the VALUE, objects copy the REFERENCE ──
let msg = "hello";
let copy = msg;
copy = "bye";
console.log(msg); // "hello" — independent value

const user = { name: "John" };
const admin = user; // both variables point at the SAME object in memory
admin.name = "Pete";
console.log(user.name); // "Pete" — mutated through the other reference

// ── Equality compares references, not contents ──
console.log({ a: 1 } === { a: 1 }); // false — two different objects
console.log(admin === user); // true — same object

// ── `const` protects the BINDING, not the object ──
const cfg = { debug: false };
cfg.debug = true; // fine — we didn't reassign cfg
// cfg = {};       // TypeError: Assignment to constant variable
console.log(cfg); // { debug: true }

// ── Shallow copy: Object.assign / spread copy only the top level ──
const source = { name: "Ann", sizes: { w: 10, h: 20 } };
const shallow = { ...source }; // same as Object.assign({}, source)
shallow.name = "Bea"; // top-level primitive: independent
shallow.sizes.w = 99; // nested object: SHARED reference!
console.log(source.name); // "Ann"
console.log(source.sizes.w); // 99 — the gotcha: nested objects are shared

// ── Deep copy: structuredClone handles nesting, cycles, Maps, Dates... ──
const deep = structuredClone(source);
deep.sizes.h = 1;
console.log(source.sizes.h); // 20 — truly independent
// structuredClone limits: throws on functions, DOM nodes; loses prototypes.
// JSON.parse(JSON.stringify(x)) is the old trick, but it drops undefined,
// functions, symbols, and turns Dates into strings.

// ── Cycles: structuredClone survives them, JSON does not ──
const node = { name: "root" };
node.self = node;
const cloned = structuredClone(node);
console.log(cloned.self === cloned); // true — cycle preserved, points at the clone
// JSON.stringify(node)              // TypeError: Converting circular structure
