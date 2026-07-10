// Property flags and descriptors — javascript.info 7.1
// Run: node property-flags-descriptors.js

// ── Every data property has 3 hidden flags: writable, enumerable, configurable ──
const user = { name: "John" };
console.log(Object.getOwnPropertyDescriptor(user, "name"));
// { value: 'John', writable: true, enumerable: true, configurable: true }

// ── defineProperty: unspecified flags default to FALSE (unlike normal assignment) ──
const obj = {};
Object.defineProperty(obj, "hidden", { value: 42 }); // all flags false!
console.log(obj.hidden); // 42
console.log(Object.keys(obj)); // [] — not enumerable
try {
  obj.hidden = 99; // not writable → TypeError in strict mode
} catch (e) {
  console.log(e.constructor.name); // TypeError
}

// ── writable: false — read-only value ──
const math = {};
Object.defineProperty(math, "PI", { value: 3.14159, enumerable: true });
console.log(math.PI); // 3.14159
// This is exactly why Math.PI = 3 silently fails (or throws in strict mode).

// ── enumerable: false — invisible to for..in / keys / JSON, still readable ──
const player = { name: "Ann", toString() { return this.name; } };
Object.defineProperty(player, "toString", { enumerable: false });
console.log(Object.keys(player)); // [ 'name' ] — custom toString hidden like the built-in
console.log(JSON.stringify(player)); // {"name":"Ann"}
console.log(`${player}`); // Ann — still callable

// ── configurable: false — a ONE-WAY door ──
// Forbids: delete, changing flags, switching data <-> accessor.
// Special case: you may still flip writable true→false (tightening only).
const locked = {};
Object.defineProperty(locked, "id", { value: 1, writable: true, configurable: false });
locked.id = 2; // writable still true → fine
console.log(locked.id); // 2
try {
  Object.defineProperty(locked, "id", { enumerable: true }); // can't change flags
} catch (e) {
  console.log(e.constructor.name); // TypeError
}
try {
  delete locked.id; // non-configurable: strict mode throws (sloppy: returns false)
} catch (e) {
  console.log(e.constructor.name); // TypeError — undeletable
}

// ── Object-level locks ──
const sealed = Object.seal({ a: 1 }); // no add/delete; values still writable
sealed.a = 2;
console.log(sealed.a, Object.isSealed(sealed)); // 2 true
const frozen = Object.freeze({ a: 1 }); // seal + all writable:false
console.log(Object.isFrozen(frozen)); // true
// preventExtensions: only blocks ADDING. All three are shallow.

// ── Cloning WITH flags (and symbols, and accessors) ──
const src = {};
Object.defineProperty(src, "secret", { value: "s", enumerable: false });
console.log({ ...src }.secret); // undefined — spread copies only enumerable props
const trueClone = Object.defineProperties({}, Object.getOwnPropertyDescriptors(src));
console.log(Object.getOwnPropertyDescriptor(trueClone, "secret").value); // s
