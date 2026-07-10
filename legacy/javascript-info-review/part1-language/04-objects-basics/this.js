// Object methods and "this" — javascript.info 4.4
// Run: node this.js
// NOTE: this file is an ES module, so it runs in strict mode automatically.

// ── Rule: `this` is decided at CALL time by what's left of the dot ──
const user = {
  name: "John",
  sayHi() {
    console.log(`Hi, I'm ${this.name}`);
  },
};
user.sayHi(); // "Hi, I'm John" — called as user.sayHi(), so this === user

// ── Gotcha #1: detaching a method loses `this` ──
const hi = user.sayHi; // just a function value now; the `user.` is gone
try {
  hi(); // strict mode: this === undefined → TypeError reading .name
} catch (e) {
  console.log(e.constructor.name); // TypeError
}
// (In sloppy mode `this` would be globalThis — arguably worse: silent bugs.)

// ── Gotcha #2: passing a method as a callback is the same detachment ──
setTimeout(user.sayHi.bind(user), 0); // fix: bind (or () => user.sayHi())
// setTimeout(user.sayHi, 0)          // would throw like above

// ── Two objects sharing one function: this follows the call site ──
function whoAmI() {
  console.log(this.name);
}
const a = { name: "A", whoAmI };
const b = { name: "B", whoAmI };
a.whoAmI(); // "A"
b.whoAmI(); // "B"

// ── Arrow functions have NO own `this`: they capture the enclosing one ──
const team = {
  title: "core",
  members: ["ann", "bob"],
  list() {
    // arrow inherits `this` from list() → team. A regular function wouldn't.
    this.members.forEach((m) => console.log(`${this.title}: ${m}`));
  },
};
team.list(); // "core: ann" / "core: bob"

// ── ...which also means arrows make BAD methods ──
const broken = {
  name: "obj",
  greet: () => console.log(this?.name), // `this` = module scope (undefined), not broken
};
broken.greet(); // undefined — the object literal does NOT create a this scope

// ── Chaining: return this ──
const counter = {
  n: 0,
  inc() {
    this.n++;
    return this; // enables chaining
  },
};
console.log(counter.inc().inc().inc().n); // 3
