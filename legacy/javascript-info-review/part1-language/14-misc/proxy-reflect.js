// Proxy and Reflect — javascript.info 14.1
// Run: node proxy-reflect.js

// ── Proxy: intercept fundamental operations via trap handlers ──
// No traps = transparent forwarding:
let target = { answer: 42 };
console.log(new Proxy(target, {}).answer); // 42

// get trap — defaults for missing keys:
const dict = new Proxy(
  { hello: "hola" },
  {
    get: (t, prop) => (prop in t ? t[prop] : `[no translation for ${String(prop)}]`),
  },
);
console.log(dict.hello, dict.bye); // hola [no translation for bye]

// set trap — validation (return true for success, false → TypeError in strict):
const numbers = new Proxy([], {
  set(t, prop, val) {
    if (typeof val === "number" || prop === "length") {
      t[prop] = val;
      return true;
    }
    return false;
  },
});
numbers.push(1);
try {
  numbers.push("text");
} catch (e) {
  console.log(e.constructor.name); // TypeError — the proxy rejected the write
}
console.log(numbers.length); // 1

// has trap — hijack the `in` operator:
const range = new Proxy(
  { from: 1, to: 10 },
  { has: (t, prop) => t.from <= prop && prop <= t.to }, // (prop coerces from string)
);
console.log(5 in range, 50 in range); // true false

// deleteProperty/ownKeys/getOwnPropertyDescriptor — hide "private" _props:
const user = new Proxy(
  { name: "Ann", _password: "secret" },
  {
    get(t, p) {
      if (String(p).startsWith("_")) throw new Error("denied");
      return Reflect.get(t, p);
    },
    ownKeys: (t) => Reflect.ownKeys(t).filter((k) => !String(k).startsWith("_")),
  },
);
console.log(Object.keys(user)); // [ 'name' ]
try {
  user._password;
} catch (e) {
  console.log(e.message); // denied
}

// apply trap — proxying FUNCTIONS (better than wrapper decorators: keeps name/length):
function sum(a, b) {
  return a + b;
}
const timedSum = new Proxy(sum, {
  apply(t, thisArg, args) {
    console.log(`  calling with ${args}`);
    return Reflect.apply(t, thisArg, args);
  },
});
console.log(timedSum(2, 3), timedSum.name, timedSum.length); // calling with 2,3 / 5 sum 2

// ── Reflect: the trap operations as functions, with matching signatures ──
// Reflect.get/set/has/deleteProperty/ownKeys/apply/construct...
// Inside traps, Reflect.* is the correct "do the default thing" — especially
// because it forwards the RECEIVER, keeping getters correct through inheritance:
const proto = new Proxy(
  {
    _name: "proto",
    get name() {
      return this._name; // `this` must be the INHERITING object, not the target
    },
  },
  {
    get: (t, prop, receiver) => Reflect.get(t, prop, receiver), // receiver preserved!
  },
);
const child = Object.create(proto);
child._name = "child";
console.log(child.name); // child — with `t[prop]` instead, this would wrongly be "proto"

// ── Limitations worth knowing ──
// - Built-ins with "internal slots" (Map, Set, Date) break through naive proxies:
//   their methods need the REAL object. Fix: bind methods to target in the get trap.
// - Private #fields have the same problem (they're slots, not properties).
// - proxy !== target: identity-keyed code (Maps, ===) treats them as different objects.
// This is the machinery behind Vue 3 reactivity, MobX, mocking libraries, ORMs.
