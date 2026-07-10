// Methods of primitives + Strings — javascript.info 5.1, 5.3
// Run: node primitives-strings.js  (this is a module → strict mode)

// ── Primitives get methods via temporary "wrapper objects" ──
const str = "hello";
console.log(str.toUpperCase()); // HELLO — engine wraps str in a String object,
// calls the method, discards the wrapper. Consequence: you can't store state on it.
try {
  str.test = 5; // strict mode: TypeError (sloppy mode: silent no-op — worse)
} catch (e) {
  console.log(e.constructor.name); // TypeError
}

// ── null/undefined have NO methods; new String() is a trap ──
console.log(typeof "x", typeof new String("x")); // string object
console.log(new String("x") == "x", new String("x") === "x"); // true false — never use wrappers

// ── Strings are immutable ──
let s = "Hi";
try {
  s[0] = "h"; // strict mode: TypeError; there's no in-place edit, ever
} catch (e) {
  console.log(e.constructor.name); // TypeError
}
s = "h" + s.slice(1); // the only way: build a new string
console.log(s); // hi

// ── slice vs substring vs substr ──
const t = "stringify";
console.log(t.slice(2, 5)); // rin — the one to use
console.log(t.slice(-4)); // gify — negatives count from the end
console.log(t.substring(5, 2)); // rin — substring SWAPS reversed args (surprise)
console.log(t.slice(5, 2)); // (empty) — slice returns "" instead

// ── Searching ──
console.log(t.indexOf("i")); // 3
console.log(t.includes("ring")); // true — prefer includes/startsWith/endsWith
console.log(t.at(-1)); // y — at() accepts negatives, [i] doesn't
console.log(t[-1]); // undefined

// ── Comparison is by UTF-16 code units, not "alphabetical" ──
console.log("a" > "Z"); // true — lowercase codes are higher
console.log("Österreich" > "Zealand"); // true — Ö (214) > Z (90); wrong for humans
console.log("Österreich".localeCompare("Zealand") < 0); // true — locale-aware fix

// ── Surrogate pairs: length counts code UNITS ──
const script = "𝒳"; // U+1D4B3, outside the 16-bit range
console.log(script.length); // 2 — two surrogate halves
console.log([...script].length); // 1 — iteration is code-point aware
console.log(script.codePointAt(0).toString(16)); // 1d4b3
// script.slice(0, 1) would give a lone garbage surrogate — slicing can break emoji.
