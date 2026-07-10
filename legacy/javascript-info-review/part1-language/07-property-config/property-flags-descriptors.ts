// Property flags — the TypeScript lens
// Run: npx tsx property-flags-descriptors.ts

// TS has no static notion of enumerable/configurable — those stay runtime-only.
// What maps across: writable ↔ readonly, freeze ↔ Readonly<T>.

// ── Object.freeze IS typed: it returns Readonly<T> ──
const cfg = Object.freeze({ debug: false, retries: 3 });
// cfg.debug = true; // TS error: readonly (AND a runtime no-op/throw — rare double coverage)
console.log(cfg.retries); // 3
// But still shallow, statically and dynamically:
const nested = Object.freeze({ inner: { x: 1 } });
nested.inner.x = 2; // compiles and works
console.log(nested.inner.x); // 2

// ── readonly vs writable:false — related but NOT the same ──
// readonly is erased at compile; a non-readonly ALIAS can still write:
interface Config {
  readonly port: number;
}
const c: Config = { port: 80 };
const mutable = c as { port: number }; // one cast and the protection is gone
mutable.port = 8080;
console.log(c.port); // 8080 — readonly never existed at runtime
// writable:false survives at runtime but TS doesn't know about it. Use both for real immutability.

// ── defineProperty: TS can't track dynamically added props on a sealed type ──
const obj: Record<string, unknown> = {};
Object.defineProperty(obj, "hidden", { value: 42 });
console.log(obj.hidden); // 42 — typed unknown; index signature is the practical out

// ── getOwnPropertyDescriptor returns PropertyDescriptor | undefined ──
const d = Object.getOwnPropertyDescriptor(cfg, "debug");
console.log(d?.writable, d?.enumerable); // false true

// ── as const: the compile-time freeze — deep, unlike runtime freeze ──
const palette = {
  primary: "#00f",
  spacing: { sm: 4, lg: 16 },
} as const;
// palette.spacing.sm = 8; // TS error — as const is RECURSIVE readonly
type Spacing = typeof palette.spacing.lg; // exactly 16
console.log(palette.spacing.lg satisfies Spacing); // 16
// as const costs nothing at runtime (pure annotation), freeze costs a call —
// belt-and-suspenders: `Object.freeze({...} as const)`.

// ── Modeling seal/freeze states in types ──
function seal<T extends object>(o: T): Readonly<T> {
  return Object.freeze(o); // narrowest honest return type
}
const s = seal({ a: 1 });
console.log(Object.isFrozen(s)); // true
