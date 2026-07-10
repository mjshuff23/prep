// Currying and partials — javascript.info 14.3 (see also bind partials, ch 6)
// Run: node currying.js

// ── Currying: f(a, b, c) → f(a)(b)(c) — a TRANSFORM, not just "partial calls" ──
const curriedSum = (a) => (b) => (c) => a + b + c;
console.log(curriedSum(1)(2)(3)); // 6

// ── The advanced version: callable BOTH ways ──
function curry(func) {
  return function curried(...args) {
    if (args.length >= func.length) return func.apply(this, args); // enough args → call
    return (...more) => curried.apply(this, [...args, ...more]); // else keep collecting
  };
}
function sum3(a, b, c) {
  return a + b + c;
}
const cs = curry(sum3);
console.log(cs(1, 2, 3)); // 6 — still callable normally
console.log(cs(1)(2, 3)); // 6
console.log(cs(1)(2)(3)); // 6
// Requires a FIXED-LENGTH function: func.length is 0 for (...rest) and stops at defaults.

// ── Why bother: specialization from generic functions ──
const log = curry((date, level, message) =>
  console.log(`[${date}] ${level}: ${message}`),
);
const todayLog = log("2026-07-09"); // partially applied — date locked in
const todayError = todayLog("ERROR"); // further specialized
todayError("connection lost"); // [2026-07-09] ERROR: connection lost
todayLog("INFO", "all good"); // [2026-07-09] INFO: all good

// Config-first design makes currying useful: put the STABLE args first,
// the varying data LAST (this is why Ramda/fp-ts put the collection last):
const map = curry((fn, arr) => arr.map(fn));
const doubleAll = map((x) => x * 2);
console.log(doubleAll([1, 2, 3])); // [ 2, 4, 6 ]

// ── Currying vs partial application (precise vocabulary) ──
// Currying: transforms an n-ary function into a CHAIN of unary functions.
// Partial application: fixes SOME args of any function, arity just drops.
const partial =
  (fn, ...preset) =>
  (...rest) =>
    fn(...preset, ...rest);
const add10 = partial((a, b) => a + b, 10); // partial, not curried
console.log(add10(5)); // 15
