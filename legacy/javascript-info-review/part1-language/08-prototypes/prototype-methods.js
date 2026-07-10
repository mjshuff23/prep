// Prototype methods, objects without __proto__ — javascript.info 8.4
// Run: node prototype-methods.js

// ── The modern API ──
const animal = { eats: true };
const rabbit = Object.create(animal); // create with a given prototype
console.log(Object.getPrototypeOf(rabbit) === animal); // true
Object.setPrototypeOf(rabbit, null); // change it (see perf warning below)
console.log(Object.getPrototypeOf(rabbit)); // null

// __proto__ is the legacy accessor for the same thing — spec'd only for browser
// compat (Annex B). Use the Object.* methods in real code.

// PERF WARNING: engines heavily optimize around stable prototype chains.
// setPrototypeOf on a live object deoptimizes it — set prototypes at CREATION.

// ── Object.create with descriptors + full-fidelity cloning ──
const base = { greet() { return "hi"; } };
const obj = Object.create(base, { answer: { value: 42, enumerable: true } });
console.log(obj.greet(), obj.answer); // hi 42
const clone = Object.create(
  Object.getPrototypeOf(obj),
  Object.getOwnPropertyDescriptors(obj),
); // truly identical: prototype + all props with flags, getters, symbols
console.log(clone.greet(), clone.answer); // hi 42

// ── The "__proto__" key poisoning problem ──
// A plain {} treats the KEY "__proto__" specially (it's an accessor on
// Object.prototype) — user-controlled keys can corrupt your dictionary:
const dict = {};
const userKey = "__proto__"; // imagine this arrives from user input
dict[userKey] = { polluted: true }; // does NOT store a property — it SET THE PROTOTYPE
console.log(Object.keys(dict)); // [] — nothing was stored...
console.log(dict.polluted); // true (!) — ...instead dict now INHERITS from the payload

// Fix 1: prototype-less object — no inherited accessors AT ALL:
const safeDict = Object.create(null);
safeDict[userKey] = "stored fine";
console.log(safeDict[userKey]); // stored fine
console.log(Object.keys(safeDict)); // [ '__proto__' ]
// Trade-off: no toString either — console prints it as [Object: null prototype]
// Fix 2 (usually better): use a Map for user-keyed storage.

// ── JSON.parse is safe from this by construction ──
const parsed = JSON.parse('{"__proto__": {"polluted": true}}');
console.log(Object.hasOwn(parsed, "__proto__")); // true — a NORMAL own property
console.log({}.polluted); // undefined — no pollution
// (Real "prototype pollution" CVEs come from naive deep-merge functions that
// assign parsed.__proto__ onto targets with obj[key] = ... — this dict trap at scale.)

// ── Getting keys of everything ──
const s = Symbol("s");
const mixed = Object.create({ inherited: 1 });
mixed.own = 2;
mixed[s] = 3;
console.log(Object.keys(mixed)); // [ 'own' ]
console.log(Reflect.ownKeys(mixed)); // [ 'own', Symbol(s) ] — own everything, no inherited
