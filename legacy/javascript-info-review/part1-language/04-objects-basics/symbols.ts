// Symbols — the TypeScript lens
// Run: npx tsx symbols.ts

// ── `unique symbol`: a type for ONE specific symbol — needs const or readonly static ──
const ID: unique symbol = Symbol("id");
const OTHER: unique symbol = Symbol("id");
// let bad: unique symbol = Symbol();  // TS error: must be const

interface User {
  name: string;
  [ID]?: number; // symbol as a typed property key
}
const user: User = { name: "John", [ID]: 42 };
console.log(user[ID]); // 42
// console.log(user[OTHER]); // TS error: OTHER is a DIFFERENT unique symbol type

// ── Branded/nominal types: symbols fake nominal typing in a structural system ──
declare const brand: unique symbol; // type-level only — never exists at runtime
type UserId = number & { [brand]: "UserId" };
type OrderId = number & { [brand]: "OrderId" };

const asUserId = (n: number) => n as UserId;
function fetchUser(id: UserId) {
  return `user ${id}`;
}
const uid = asUserId(7);
console.log(fetchUser(uid)); // user 7
// fetchUser(7);              // TS error: number is not UserId
// fetchUser(3 as OrderId);   // TS error: OrderId is not UserId — same runtime number!

// ── Well-known symbols are typed via interfaces (Iterable, etc.) ──
class Range implements Iterable<number> {
  constructor(
    public from: number,
    public to: number,
  ) {}
  // TS checks the iterator protocol shape for you:
  [Symbol.iterator](): Iterator<number> {
    let cur = this.from;
    const last = this.to;
    return {
      next: () =>
        cur <= last ? { value: cur++, done: false } : { value: undefined, done: true },
    };
  }
}
console.log([...new Range(1, 3)]); // [ 1, 2, 3 ]

// ── keyof does NOT include symbol keys unless declared; use typeof key lookups ──
const meta = Symbol("meta");
const obj = { a: 1, [meta]: "hidden" };
type Keys = keyof typeof obj; // "a" | typeof meta — TS does track declared symbols
const k: Keys = meta;
console.log(obj[k]); // hidden
