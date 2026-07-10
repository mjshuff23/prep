// Symbol type — javascript.info 4.7
// Run: node symbols.js

// ── Every Symbol() is unique, even with the same description ──
const id1 = Symbol("id");
const id2 = Symbol("id");
console.log(id1 === id2); // false
console.log(id1.description); // "id" — just a label for debugging

// ── Use case: "hidden" properties that can't collide or be hit accidentally ──
const user = { name: "John" };
const id = Symbol("id");
user[id] = 42; // a third-party script using its own Symbol("id") can't clash
console.log(user[id]); // 42

// ── Symbols are skipped by for..in, Object.keys, and JSON ──
for (const key in user) console.log("for..in:", key); // only "name"
console.log(Object.keys(user)); // [ 'name' ]
console.log(JSON.stringify(user)); // {"name":"John"} — symbol prop invisible
// ...but NOT truly private:
console.log(Object.getOwnPropertySymbols(user)); // [ Symbol(id) ]
// Object.assign and structuredClone-like spreads DO copy symbol props:
const clone = { ...user };
console.log(clone[id]); // 42

// ── In object literals, symbol keys need [brackets] ──
const record = { [id]: "bracket syntax required" };
console.log(record[id]); // bracket syntax required

// ── Global symbol registry: Symbol.for returns the SAME symbol per key ──
const g1 = Symbol.for("app.id");
const g2 = Symbol.for("app.id");
console.log(g1 === g2); // true — app-wide (even cross-realm) shared symbol
console.log(Symbol.keyFor(g1)); // "app.id" (undefined for non-registry symbols)

// ── Well-known symbols: hooks the language itself reads ──
const range = {
  from: 1,
  to: 3,
  [Symbol.iterator]() {
    // makes the object work with for..of / spread
    let cur = this.from;
    const last = this.to;
    return { next: () => (cur <= last ? { value: cur++, done: false } : { value: undefined, done: true }) };
  },
  [Symbol.toPrimitive](hint) {
    // controls conversion (see object-to-primitive.js)
    return hint === "number" ? this.to - this.from : `range(${this.from}..${this.to})`;
  },
};
console.log([...range]); // [ 1, 2, 3 ]
console.log(`${range}`); // range(1..3)
console.log(+range); // 2

// ── Gotcha: symbols do NOT auto-convert to string ──
try {
  console.log("id is " + id1); // TypeError: Cannot convert a Symbol to a string
} catch (e) {
  console.log(e.constructor.name); // TypeError — use id1.toString() or .description
}
