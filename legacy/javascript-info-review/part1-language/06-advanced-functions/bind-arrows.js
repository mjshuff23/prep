// Function binding + Arrow functions revisited — javascript.info 6.10, 6.11
// Run: node bind-arrows.js

// ── bind: permanently glue a this (and optionally leading args) ──
const user = {
  name: "John",
  sayHi() {
    console.log(`Hi, ${this.name}!`);
  },
};
const bound = user.sayHi.bind(user);
setTimeout(bound, 0); // Hi, John! — survives detachment

// bind wins forever — it CANNOT be re-bound or overridden by call:
function whoAmI() {
  return this?.name;
}
const asAnn = whoAmI.bind({ name: "Ann" });
console.log(asAnn.call({ name: "Bea" })); // Ann — call's this is ignored
console.log(asAnn.bind({ name: "Cy" })()); // Ann — double-bind is a no-op
// ...and `new` is the ONE thing that beats bind (constructor call ignores bound this).

// ── Gotcha: user.sayHi = user.sayHi.bind(user) after object REPLACEMENT ──
let cfg = { mode: "dark", show() { console.log(this.mode); } };
const showBound = cfg.show.bind(cfg);
cfg = { mode: "light", show: cfg.show }; // new object!
showBound(); // dark — bound to the OLD object; bind captures a reference at bind time

// ── Partial application: bind with args (this = null when you don't care) ──
function mul(a, b) {
  return a * b;
}
const doubleFn = mul.bind(null, 2);
console.log(doubleFn(5), doubleFn(7)); // 10 14

// Partial WITHOUT fixing this (a decorator instead of bind):
function partial(fn, ...preset) {
  return function (...args) {
    return fn.call(this, ...preset, ...args); // this flows from the eventual call site
  };
}
const greeter = {
  name: "Ann",
  greet(time, phrase) {
    console.log(`[${time}] ${this.name}: ${phrase}`);
  },
};
greeter.greetNow = partial(greeter.greet, new Date().toTimeString().slice(0, 5));
greeter.greetNow("hello"); // [HH:MM] Ann: hello — this still works

// ── Arrows revisited: no this, no arguments, no new, no super of their own ──
console.log(typeof (() => {}).prototype); // undefined — arrows can't construct
try {
  new (() => {})();
} catch (e) {
  console.log(e.constructor.name); // TypeError
}

function outer() {
  // arrow sees outer's `arguments` — handy in forwarding wrappers:
  const deferred = () => console.log("args seen by arrow:", arguments[0]);
  deferred();
}
outer("forwarded"); // args seen by arrow: forwarded

// The design intent: arrows are for little pieces of code that should act
// entirely in their surrounding context — callbacks, not methods/constructors.
const group = {
  title: "team",
  showList(items) {
    items.forEach((item) => console.log(`${this.title}: ${item}`)); // this = group ✓
  },
};
group.showList(["a", "b"]); // team: a / team: b
