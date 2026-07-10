// Global object + Function objects/NFE + new Function — javascript.info 6.5–6.7
// Run: node function-objects.js

// ── globalThis: the one portable name for the global object ──
// browser: window/self, Node: global — globalThis works everywhere.
globalThis.sharedFlag = true; // (don't actually do this — demo only)
console.log(sharedFlag); // true — global properties are reachable bare
delete globalThis.sharedFlag;
// NOTE: top-level let/const/var in a MODULE do NOT become global properties.
// (Old non-module scripts: var did. One more reason modules are saner.)

// ── Functions are objects: name, length, custom properties ──
function ask(question, yes, no) {}
console.log(ask.name); // ask — even inferred for `const f = () => {}`
console.log(ask.length); // 3 — declared params, NOT counting rest/defaults
const withDefaults = (a, b = 1, ...rest) => {};
console.log(withDefaults.length); // 1 (!) — stops at the first default

// Function properties as static state (pre-closure style):
function sayHi() {
  sayHi.counter++;
}
sayHi.counter = 0;
sayHi();
sayHi();
console.log(sayHi.counter); // 2 — a property, NOT a variable inside; anyone can reset it

// ── Named Function Expression (NFE): a self-reference that can't be broken ──
let sayBye = function func(who) {
  if (!who) return func("Guest"); // `func` is only visible INSIDE, and always = this function
  return `Bye, ${who}`;
};
const alias = sayBye;
sayBye = null;
console.log(alias()); // Bye, Guest — recursion via `func` survived reassignment.
// With `return sayBye("Guest")` this would crash: sayBye is null now.

// ── new Function: compile a function from a string at runtime ──
const sum = new Function("a", "b", "return a + b");
console.log(sum(1, 2)); // 3
// The catch: it sees ONLY the global scope — no closures:
function makeFromString() {
  const secret = 42;
  return new Function("return typeof secret"); // can't see `secret`
}
console.log(makeFromString()()); // "undefined"
// Legit uses: templating engines, code from server. Otherwise it's eval's cousin:
// blocked by CSP, invisible to minifiers/bundlers, a security surface. Avoid.

// ── Function declarations hoist fully; expressions don't ──
console.log(hoisted()); // works — declaration is usable before its line
function hoisted() {
  return "I'm hoisted";
}
try {
  notHoisted();
} catch (e) {
  console.log(e.constructor.name); // ReferenceError (TDZ) — const f = ... isn't ready
}
const notHoisted = () => {};
