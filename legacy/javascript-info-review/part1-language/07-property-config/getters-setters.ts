// Getters/setters — the TypeScript lens
// Run: npx tsx getters-setters.ts

// ── Class accessors: typed, with asymmetric get/set types (TS 4.3+) ──
class Temperature {
  private celsius = 0;
  get value(): number {
    return this.celsius;
  }
  // setter may ACCEPT more types than the getter returns:
  set value(v: number | string) {
    this.celsius = typeof v === "string" ? parseFloat(v) : v;
  }
}
const t = new Temperature();
t.value = "21.5"; // string accepted...
console.log(t.value + 1); // 22.5 — ...number comes back out
// This models real DOM APIs (el.style.width = "10px" | number-ish inputs).

// ── Getter-only = readonly from the outside ──
class Circle {
  constructor(public radius: number) {}
  get area(): number {
    return Math.PI * this.radius ** 2;
  }
}
const c = new Circle(2);
console.log(c.area.toFixed(2)); // 12.57
// c.area = 100; // TS error: Cannot assign — no setter means readonly, checked statically
// (in plain JS this failed SILENTLY or threw at runtime; TS catches it before running)

// ── Interfaces can't distinguish accessor from data — by design ──
interface HasArea {
  readonly area: number; // satisfied by a data prop OR a getter; callers can't tell
}
const asInterface: HasArea = c;
console.log(asInterface.area > 12); // true

// ── Validation setters with never-returning throw ──
class Account {
  #balance = 0;
  get balance() {
    return this.#balance;
  }
  set balance(v: number) {
    if (v < 0) throw new RangeError("negative balance");
    this.#balance = v;
  }
}
const a = new Account();
a.balance = 100;
console.log(a.balance); // 100
try {
  a.balance = -1;
} catch (e) {
  console.log((e as Error).message); // negative balance
}

// ── Object literal accessors infer fine too ──
const user = {
  first: "Ada",
  last: "Lovelace",
  get fullName() {
    return `${this.first} ${this.last}`;
  }, // inferred string
  set fullName(v: string) {
    [this.first = "", this.last = ""] = v.split(" ");
  },
};
user.fullName = "Grace Hopper";
console.log(user.first); // Grace
