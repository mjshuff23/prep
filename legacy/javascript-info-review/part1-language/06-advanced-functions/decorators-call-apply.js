// Decorators and forwarding: call/apply — javascript.info 6.9
// Run: node decorators-call-apply.js

// ── call/apply: invoke with an explicit `this` ──
function introduce(greeting, punct) {
  return `${greeting}, I'm ${this.name}${punct}`;
}
const user = { name: "Ann" };
console.log(introduce.call(user, "Hi", "!")); // Hi, I'm Ann! — args listed
console.log(introduce.apply(user, ["Yo", "?"])); // Yo, I'm Ann? — args as array
// Modern note: f.apply(ctx, arr) ≈ f.call(ctx, ...arr); apply survives for array-likes.

// ── A decorator: wraps a function, adds behavior, keeps the interface ──
function loggingDecorator(fn) {
  return function (...args) {
    console.log(`  calling ${fn.name}(${args})`);
    return fn.apply(this, args); // ← forward BOTH this and args — the whole trick
  };
}
let double = (x) => x * 2;
double = loggingDecorator(double);
console.log(double(21)); // calling double(21) / 42

// ── WHY fn.apply(this, args), not fn(...args): object methods keep working ──
const calculator = {
  factor: 10,
  scale(x) {
    return x * this.factor;
  },
};
calculator.scale = loggingDecorator(calculator.scale);
console.log(calculator.scale(5)); // calling scale(5) / 50
// With plain fn(...args) inside the wrapper, this.factor would be a TypeError.

// ── Caching decorator (memoize) — the interview staple ──
function memoize(fn, keyFn = (...args) => JSON.stringify(args)) {
  const cache = new Map();
  return function (...args) {
    const key = keyFn(...args);
    if (!cache.has(key)) cache.set(key, fn.apply(this, args));
    return cache.get(key);
  };
}
let calls = 0;
const slowSquare = memoize((x) => (calls++, x * x));
console.log(slowSquare(4), slowSquare(4), calls); // 16 16 1 — second hit was cached

// ── Decorator limitations ──
// 1. Wrapper loses fn's properties (fn.name, custom props) unless copied over.
const wrapped = loggingDecorator(function original() {});
console.log(wrapped.name); // "" (anonymous wrapper) — original identity gone
// 2. If the function relies on === identity (removeEventListener!), the wrapped
//    version is a DIFFERENT function. Keep a reference to the exact one you added.

// ── Method borrowing: call/apply on someone else's method ──
function argsToUpper() {
  // `arguments` is array-like: borrow Array's join
  return [].join.call(arguments, "-").toUpperCase();
}
console.log(argsToUpper("a", "b", "c")); // A-B-C

const arrayLike = { 0: "x", 1: "y", length: 2 };
console.log(Array.prototype.map.call(arrayLike, (s) => s + "!")); // [ 'x!', 'y!' ]
