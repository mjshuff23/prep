// Iterables — javascript.info 5.6
// Run: node iterables.js

// ── The protocol: [Symbol.iterator]() returns { next(): {value, done} } ──
const range = {
  from: 1,
  to: 5,
  [Symbol.iterator]() {
    let current = this.from;
    const last = this.to;
    return {
      next() {
        return current <= last
          ? { value: current++, done: false }
          : { value: undefined, done: true };
      },
    };
  },
};
console.log([...range]); // [ 1, 2, 3, 4, 5 ] — spread uses the protocol
for (const n of range) process.stdout.write(n + " "); // 1 2 3 4 5
console.log();

// ── for..of vs for..in: values via iterator vs KEYS via enumeration ──
const arr = ["a", "b"];
arr.extra = "!"; // (don't do this — for demonstration)
for (const v of arr) console.log("of:", v); // of: a / of: b
for (const k in arr) console.log("in:", k); // in: 0 / in: 1 / in: extra (!)
// for..in walks ALL enumerable string keys incl. inherited — never use it on arrays.

// ── Iterable vs array-like: different things, both fed to Array.from ──
const arrayLike = { 0: "x", 1: "y", length: 2 }; // indexed + length, NOT iterable
try {
  [...arrayLike];
} catch (e) {
  console.log(e.constructor.name); // TypeError: not iterable
}
console.log(Array.from(arrayLike)); // [ 'x', 'y' ] — from() accepts both

// ── Calling an iterator manually (how for..of works under the hood) ──
const it = range[Symbol.iterator]();
console.log(it.next()); // { value: 1, done: false }
console.log(it.next()); // { value: 2, done: false }

// ── Strings iterate by code POINTS (surrogate-safe) ──
for (const ch of "a𝒳") console.log(ch); // a / 𝒳 — indexing would split 𝒳

// ── Infinite iterables are fine — consumers decide when to stop ──
const naturals = {
  *[Symbol.iterator]() {
    // generator shorthand (chapter 12)
    let n = 1;
    while (true) yield n++;
  },
};
const firstThree = [];
for (const n of naturals) {
  firstThree.push(n);
  if (n >= 3) break; // break calls it.return() → cleanup hook for generators
}
console.log(firstThree); // [ 1, 2, 3 ]
