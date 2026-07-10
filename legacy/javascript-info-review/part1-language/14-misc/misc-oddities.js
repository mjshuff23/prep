// Eval + Reference Type + BigInt + Unicode + WeakRef — javascript.info 14.2, 14.4–14.7
// Run: node misc-oddities.js

// ══ eval (14.2): don't. But know the semantics. ══
console.log(eval("2 + 2")); // 4 — result of the last expression
// Direct eval sees local scope (and blocks minification of it!); INDIRECT eval
// (any call not literally named eval) runs in GLOBAL scope:
globalThis.g = "global";
{
  const local = "local";
  console.log(eval("typeof local")); // "string" — direct eval sees `local`
  const indirect = eval;
  console.log(indirect("typeof local")); // "undefined" — global scope only
}
delete globalThis.g;
// Modern reality: CSP blocks it, JIT can't optimize around it, injection risk.
// If you truly need code-from-string, new Function is the lesser evil (ch 6).

// ══ Reference Type (14.4): why obj.method() keeps `this` but (obj.method)() ≠ f() ══
const user = {
  name: "John",
  hi() {
    console.log(this?.name);
  },
};
user.hi(); // John — obj.method() evaluates to a REFERENCE (base=user, name=hi)
// and the call consumes base as `this`. ANY other operation on it — assignment,
// ||, comma — collapses the reference to a plain function value, dropping user:
(user.name === "John" ? user.hi : null)(); // undefined
const f = user.hi;
f(); // undefined
(user.hi)(); // John (!) — parens alone do NOT collapse the reference

// ══ BigInt (14.5): arbitrary-precision integers ══
const big = 9007199254740993n; // beyond MAX_SAFE_INTEGER — exact with n suffix
console.log(big + 1n); // 9007199254740994n
console.log(10n / 3n); // 3n — integer division, rounds toward zero
try {
  1n + 1; // NO implicit mixing with number
} catch (e) {
  console.log(e.constructor.name); // TypeError
}
console.log(Number(10n) + 1, BigInt(5) + 5n); // 11 10n — convert explicitly
console.log(1n == 1, 1n === 1); // true false — == coerces, === compares types too
console.log(typeof 1n); // bigint
// JSON.stringify(1n) throws — BigInt has no default JSON representation.

// ══ Unicode & string internals (14.6) ══
// Strings are UTF-16 code units. Three layers of "character":
const s = "𝒳"; // 1 code point, 2 code units (surrogate pair)
console.log(s.length, [...s].length); // 2 1
console.log(s.charCodeAt(0).toString(16), s.codePointAt(0).toString(16)); // d835 1d4b3
// Combining marks: Ŝ can be one code point or S + composing accent:
const s1 = "ŝ"; // ŝ precomposed
const s2 = "ŝ"; // s + combining circumflex
console.log(s1, s2, s1 === s2); // ŝ ŝ false (!) — look identical, compare different
console.log(s1 === s2.normalize()); // true — NFC normalization fixes it
// Always normalize user input before comparing/hashing (usernames!).
console.log("Z".codePointAt(0) < "a".codePointAt(0)); // true — why "a" > "Z" in ch 5

// ══ WeakRef & FinalizationRegistry (14.7): don't-keep-alive references ══
let data = { big: "payload" };
const ref = new WeakRef(data); // does NOT prevent GC of data
console.log(ref.deref()?.big); // payload — deref may return undefined after GC
// Use case: caches where entries may evaporate under memory pressure.
const registry = new FinalizationRegistry((held) => {
  // Runs SOMETIME after the object is collected — timing is unspecified!
  console.log("collected:", held); // (may never print in a short script)
});
registry.register(data, "data-object");
data = null; // now only weakly reachable
// Rules of thumb: GC timing is unobservable-by-design; never build program LOGIC
// on WeakRef/FinalizationRegistry. WeakMap/WeakSet cover 95% of real needs.
console.log("end (finalizer may or may not have printed)");
