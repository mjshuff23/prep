// Class basic syntax + statics — javascript.info 9.1, 9.3
// Run: node class-basics.js

// ── What `class` really builds: a constructor function + prototype methods ──
class User {
  static #count = 0; // static private field
  role = "member"; // instance field: set per-object, BEFORE constructor body

  constructor(name) {
    this.name = name;
    User.#count++;
  }
  sayHi() {
    return `Hi, ${this.name}`;
  } // goes on User.prototype, non-enumerable
  static get count() {
    return User.#count;
  } // static: on User itself, not instances
}
const u = new User("John");
console.log(typeof User); // function — a class IS a function
console.log(u.sayHi()); // Hi, John
console.log(Object.hasOwn(u, "role"), Object.hasOwn(u, "sayHi")); // true false
console.log(User.count); // 1

// ── Not just sugar: 4 real differences from function-style constructors ──
// 1. Must be called with new:
try {
  User("x");
} catch (e) {
  console.log(e.constructor.name); // TypeError
}
// 2. Methods are non-enumerable (for..in over instances stays clean):
const keys = [];
for (const k in u) keys.push(k);
console.log(keys); // [ 'role', 'name' ] — no sayHi
// 3. Class body is always strict mode.
// 4. Class declarations are NOT hoisted usable-before-definition (TDZ like let).

// ── Class expressions & classes as values ──
const Named = class Inner {
  whoAmI() {
    return Inner.name; // NFE-style inner name
  }
};
console.log(new Named().whoAmI()); // Inner
function makeClass(greeting) {
  return class {
    hi() {
      return greeting; // classes close over variables like any function
    }
  };
}
console.log(new (makeClass("yo"))().hi()); // yo

// ── Fields vs prototype methods: the arrow-field trade-off (see ch 6) ──
class Button {
  constructor(label) {
    this.label = label;
  }
  clickField = () => this.label; // per-instance, this-safe
  clickProto() {
    return this.label; // shared, loses this when detached
  }
}
const b1 = new Button("a");
const b2 = new Button("b");
console.log(b1.clickField === b2.clickField); // false — one closure per instance
console.log(b1.clickProto === b2.clickProto); // true — shared on prototype

// ── Field initialization order gotcha: fields run top-down, before constructor ──
class Order {
  a = this.b; // undefined! b isn't initialized yet
  b = 1;
  c = this.b + 1; // 2 — b IS ready by now
}
console.log(new Order()); // Order { a: undefined, b: 1, c: 2 }

// ── Statics are inherited too (via the constructor-function chain) ──
class Admin extends User {}
console.log(Admin.count >= 1); // true — Admin → User constructor chain
console.log(Object.getPrototypeOf(Admin) === User); // true — the "second chain"
