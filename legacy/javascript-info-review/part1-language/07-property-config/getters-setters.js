// Property getters and setters — javascript.info 7.2
// Run: node getters-setters.js

// ── Accessor properties: functions that MASQUERADE as values ──
const user = {
  name: "John",
  surname: "Smith",
  get fullName() {
    return `${this.name} ${this.surname}`;
  },
  set fullName(value) {
    [this.name, this.surname] = value.split(" ");
  },
};
console.log(user.fullName); // John Smith — read like a plain property
user.fullName = "Alice Cooper"; // assignment routes through the setter
console.log(user.name, user.surname); // Alice Cooper

// ── Getter with no setter → assignment silently fails (throws in strict) ──
const circle = {
  radius: 2,
  get area() {
    return Math.PI * this.radius ** 2;
  },
};
try {
  circle.area = 100;
} catch (e) {
  console.log(e.constructor.name); // TypeError — no setter
}

// ── Accessor descriptors: get/set REPLACE value/writable ──
console.log(Object.getOwnPropertyDescriptor(user, "fullName"));
// { get: [Function...], set: [Function...], enumerable: true, configurable: true }
// A property is EITHER data or accessor — defining both value and get throws.

// ── The classic use: validated/computed fields with a backing "_" property ──
const account = {
  get balance() {
    return this._balance ?? 0;
  },
  set balance(value) {
    if (value < 0) throw new RangeError("balance can't be negative");
    this._balance = value;
  },
};
account.balance = 100;
console.log(account.balance); // 100
try {
  account.balance = -5;
} catch (e) {
  console.log(e.message); // balance can't be negative
}
// Convention only: _balance is still public. Real privacy: closures (ch 6) or #fields (ch 9).

// ── Killer feature: evolve a data property into a computed one WITHOUT breaking callers ──
function UserCtor(name, birthday) {
  this.name = name;
  this.birthday = birthday;
  // Old code stored `age` as data. New code computes it — same external API:
  Object.defineProperty(this, "age", {
    get() {
      return new Date().getFullYear() - this.birthday.getFullYear();
    },
  });
}
const john = new UserCtor("John", new Date(1992, 6, 1));
console.log(john.age >= 30); // true — callers never know it became a getter

// ── Gotcha: getters run on EVERY read — keep them cheap and side-effect free ──
let reads = 0;
const tracked = {
  get value() {
    reads++;
    return 42;
  },
};
tracked.value + tracked.value + tracked.value;
console.log(reads); // 3 — an expensive getter here means 3x the cost (memoize if needed)
