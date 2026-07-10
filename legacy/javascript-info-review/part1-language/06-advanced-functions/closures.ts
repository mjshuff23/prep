// Closures — the TypeScript lens
// Run: npx tsx closures.ts

// Closures work identically; TS types the RESULTING function shapes and
// lets you express "state hidden behind an interface" precisely.

// ── Inference through closures ──
function makeCounter() {
  let count = 0;
  return () => count++; // inferred: () => number
}
const counter = makeCounter(); // counter: () => number
console.log(counter(), counter()); // 0 1

// ── Typing a closure-based module: the interface IS the privacy boundary ──
interface Account {
  deposit(n: number): void;
  readonly balance: number; // read-only VIEW; the real state is closed over
}
function bankAccount(initial: number): Account {
  let balance = initial; // invisible to consumers — not even a private field to reflect on
  return {
    deposit(n) {
      balance += n;
    },
    get balance() {
      return balance;
    },
  };
}
const acct = bankAccount(100);
acct.deposit(50);
console.log(acct.balance); // 150
// acct.balance = 0; // TS error: readonly

// ── Generic closures: `once` with full type flow ──
function once<A extends unknown[], R>(fn: (...args: A) => R): (...args: A) => R {
  let called = false;
  let result: R;
  return (...args) => {
    if (!called) {
      called = true;
      result = fn(...args);
    }
    return result!; // `!`: TS can't prove result is set when called is true
  };
}
const initDb = once((url: string) => `connected:${url}`);
console.log(initDb("pg://x")); // connected:pg://x
console.log(initDb("ignored")); // connected:pg://x — memoized
// initDb(42); // TS error: argument types preserved by the generic

// ── Narrowing does NOT survive into closures (a real TS gotcha) ──
function demo(x: string | null) {
  if (x === null) return;
  // x is string here...
  setTimeout(() => {
    // ...and TS still narrows here ONLY because x is a parameter never reassigned.
    console.log(x.toUpperCase());
  }, 0);

  let y: string | null = "hi";
  if (y !== null) {
    // For MUTABLE bindings, narrowing resets inside callbacks that run later:
    // setTimeout(() => y.toUpperCase()); // TS error: y is possibly null
    const yFixed = y; // snapshot into a const → narrowing sticks
    setTimeout(() => console.log(yFixed.toUpperCase()), 0); // HI
  }
}
demo("hello"); // HELLO (async), HI

// ── const in loops: TS + let per-iteration semantics = no [3,3,3] bug ──
const fns: Array<() => number> = [];
for (let i = 0; i < 3; i++) fns.push(() => i);
console.log(fns.map((f) => f())); // [ 0, 1, 2 ]
