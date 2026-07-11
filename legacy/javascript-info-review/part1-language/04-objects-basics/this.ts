// "this" — the TypeScript lens
// Run: npx tsx this.ts
// TS can TYPE `this` and catch detachment bugs at compile time.

// ── `this` parameter: a fake first parameter, erased at runtime ──
function sayHi(this: { name: string }) {
  console.log(`Hi, I'm ${this.name}`);
}
const user = { name: "John", sayHi };
user.sayHi(); // OK — this is { name: string }
// sayHi();   // TS error: The 'this' context of type 'void' is not assignable

// ── `this: void` means "this callback must not need a receiver" ──
function onTick(this: void) {
  console.log("tick");
}
setTimeout(onTick, 0); // safe: onTick does not need any `this` value

function runDetached(callback: (this: void) => void) {
  callback();
}

const timerOwner = {
  name: "TimerOwner",
  tick(this: { name: string }) {
    console.log(`${this.name} tick`);
  },
};

runDetached(onTick); // OK
// runDetached(timerOwner.tick); // TS error: this callback needs `{ name: string }`
runDetached(timerOwner.tick.bind(timerOwner)); // OK: bind supplies the missing this

// ── Classes + strict mode: TS still can't stop runtime detachment... ──
class Counter {
  n = 0;
  inc() {
    this.n++;
    return this;
  }
  // Arrow property: `this` is bound per-instance at construction time.
  // Costs one closure per instance, but survives detachment.
  reset = () => {
    this.n = 0;
  };
}
const c = new Counter();
const inc = c.inc;
try {
  inc(); // compiles (method type doesn't track its receiver) — runtime TypeError
} catch (e) {
  console.log((e as Error).constructor.name); // TypeError
}
const reset = c.reset;
reset(); // fine — arrow captured the instance
console.log(c.n); // 0

// ── Polymorphic `this` type: fluent APIs that survive subclassing ──
class QueryBuilder {
  parts: string[] = [];
  where(clause: string): this {
    // `this` type, not `QueryBuilder`
    this.parts.push(clause);
    return this;
  }
}
class SqlQueryBuilder extends QueryBuilder {
  orderBy(col: string): this {
    this.parts.push(`ORDER BY ${col}`);
    return this;
  }
}
// Because where() returns `this` (not QueryBuilder), chaining keeps the subtype:
const q = new SqlQueryBuilder().where("x = 1").orderBy("y"); // OK
console.log(q.parts); // [ 'x = 1', 'ORDER BY y' ]
