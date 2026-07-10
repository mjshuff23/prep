// Closures + variable scope + the old "var" — javascript.info 6.3, 6.4
// Run: node closures.js

// ── The mechanism: every function remembers the Lexical Environment it was BORN in ──
function makeCounter() {
  let count = 0; // lives in makeCounter's environment
  return function () {
    return count++; // found via the [[Environment]] link — a closure
  };
}
const counter = makeCounter();
console.log(counter(), counter(), counter()); // 0 1 2

// ── Each CALL creates a fresh environment — independent counters ──
const counter2 = makeCounter();
console.log(counter2()); // 0 — not 3; separate closure

// ── Two closures from ONE call SHARE the environment ──
function makePair() {
  let value = 0;
  return { inc: () => ++value, get: () => value };
}
const pair = makePair();
pair.inc();
pair.inc();
console.log(pair.get()); // 2 — inc and get see the same `value`

// ── Closures capture VARIABLES, not values (the loop interview classic) ──
const fnsVar = [];
for (var i = 0; i < 3; i++) fnsVar.push(() => i); // var: ONE i for the whole loop
console.log(fnsVar.map((f) => f())); // [ 3, 3, 3 ]

const fnsLet = [];
for (let j = 0; j < 3; j++) fnsLet.push(() => j); // let: fresh j PER ITERATION
console.log(fnsLet.map((f) => f())); // [ 0, 1, 2 ]

// Pre-let fix, still seen in old code — IIFE copies the value:
const fnsIife = [];
for (var k = 0; k < 3; k++) {
  ((kk) => fnsIife.push(() => kk))(k);
}
console.log(fnsIife.map((f) => f())); // [ 0, 1, 2 ]

// ── var vs let: function-scoped, hoisted-as-undefined, redeclarable ──
function varDemo() {
  console.log(x); // undefined — declaration hoisted, value not (let would be TDZ ReferenceError)
  if (true) {
    var x = 1; // escapes the block — var ignores { }
  }
  console.log(x); // 1
}
varDemo();

// let in the Temporal Dead Zone:
try {
  console.log(y);
  let y = 5;
} catch (e) {
  console.log(e.constructor.name); // ReferenceError — exists but untouchable before `let`
}

// ── Practical closure patterns ──
// once:
const once = (fn) => {
  let done = false,
    result;
  return (...args) => (done ? result : ((done = true), (result = fn(...args))));
};
const init = once(() => (console.log("initializing"), 42));
console.log(init(), init()); // initializing / 42 42

// private state without classes:
function bankAccount(balance) {
  return {
    deposit: (n) => (balance += n),
    getBalance: () => balance, // `balance` is inaccessible from outside — truly private
  };
}
const acct = bankAccount(100);
acct.deposit(50);
console.log(acct.getBalance()); // 150
console.log(acct.balance); // undefined — no way in

// ── Memory note ──
// A closure keeps its WHOLE outer environment alive (engines optimize, but a
// captured huge array outlives the call). Null out big references you're done with.
