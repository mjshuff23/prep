// Native prototypes — javascript.info 8.3
// Run: node native-prototypes.js

// ── Everything built-in is the same mechanism ──
// {} is new Object() → Object.prototype; [] → Array.prototype → Object.prototype
const arr = [1, 2, 3];
console.log(Object.getPrototypeOf(arr) === Array.prototype); // true
console.log(Object.getPrototypeOf(Array.prototype) === Object.prototype); // true
console.log(arr.join("-")); // 1-2-3 — join lives on Array.prototype, not on arr
console.log(Object.hasOwn(arr, "join")); // false

// Functions too:
function f() {}
console.log(Object.getPrototypeOf(f) === Function.prototype); // true
console.log(typeof f.call, typeof f.bind); // function function — inherited

// Primitives reach methods through wrapper prototypes (String/Number/Boolean):
console.log(Object.getPrototypeOf("") === String.prototype); // true
// null and undefined have NO wrappers — that's why null.foo is a TypeError.

// ── Shadowing: closest wins ──
const chatty = [1, 2];
chatty.toString = function () {
  return `custom(${this.length})`;
};
console.log(`${chatty}`); // custom(2) — own beats Array.prototype's
console.log(`${[1, 2]}`); // 1,2 — Array.prototype.toString (join) beats Object's

// ── Modifying native prototypes: possible, and almost always wrong ──
// One legit use: POLYFILLS — implementing a spec method for old engines.
if (!String.prototype.demoRepeatTwice) {
  Object.defineProperty(String.prototype, "demoRepeatTwice", {
    value: function () {
      return this + String(this);
    },
    enumerable: false, // crucial: don't pollute for..in over strings' objects
    configurable: true,
  });
}
console.log("ab".demoRepeatTwice()); // abab
// Why it's dangerous otherwise: globals are shared — two libraries adding
// String.prototype.format with different behavior = unfindable bugs. And future
// standards may claim the name (the "SmooshGate" incident: Array.prototype.flatten
// clashed with MooTools and had to be renamed to .flat).
delete String.prototype.demoRepeatTwice; // clean up our demo

// ── Method borrowing from native prototypes ──
const arrayLike = { 0: "a", 1: "b", length: 2 };
console.log(Array.prototype.join.call(arrayLike, "+")); // a+b
// join only needs indexes + length — duck typing lets any object qualify.

// ── console.log reads live state (Node quirk worth knowing) ──
const later = [];
Object.getPrototypeOf(later); // (just proving the chain is queryable at runtime)
console.log([].constructor === Array); // true — constructor round-trips
