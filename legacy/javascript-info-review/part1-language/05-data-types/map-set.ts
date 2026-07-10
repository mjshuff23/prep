// Map & Set — the TypeScript lens
// Run: npx tsx map-set.ts

// ── Map<K, V> is generic; get() returns V | undefined ──
const prices = new Map<string, number>([
  ["apple", 1],
  ["banana", 2],
]);
const p = prices.get("apple"); // number | undefined — the miss is in the type
console.log((p ?? 0) + 1); // 2
// prices.set("pear", "cheap"); // TS error: string is not number

// ── The has()-then-get() annoyance: TS doesn't narrow across calls ──
if (prices.has("apple")) {
  // prices.get("apple") is STILL number | undefined here — has() can't narrow get()
}
// Idioms: `const v = m.get(k); if (v !== undefined) ...` or a helper:
function getOrThrow<K, V>(m: Map<K, V>, k: K): V {
  const v = m.get(k);
  if (v === undefined) throw new Error(`missing key: ${String(k)}`);
  return v;
}
console.log(getOrThrow(prices, "banana")); // 2

// getOrDefault / upsert pattern:
function getOrInit<K, V>(m: Map<K, V>, k: K, init: () => V): V {
  let v = m.get(k);
  if (v === undefined) {
    v = init();
    m.set(k, v);
  }
  return v;
}
const groups = new Map<string, string[]>();
getOrInit(groups, "fruit", () => []).push("apple");
getOrInit(groups, "fruit", () => []).push("pear");
console.log(groups.get("fruit")); // [ 'apple', 'pear' ]

// ── Map vs Record<string, T>: use Map for dynamic keys, Record for closed shapes ──
const config: Record<"host" | "port", string> = { host: "x", port: "5432" };
console.log(config.host); // x — dot access, JSON-serializable, but string keys only

// ── Set<T> ──
const roles = new Set<"admin" | "viewer">(["admin"]);
console.log(roles.has("admin")); // true
// roles.add("root"); // TS error — the union constrains additions

// ── ReadonlyMap / ReadonlySet: expose lookups, forbid mutation ──
function report(m: ReadonlyMap<string, number>): string {
  return [...m].map(([k, v]) => `${k}=${v}`).join(",");
}
console.log(report(prices)); // apple=1,banana=2
// Inside report, m.set(...) would be a TS error.

// ── WeakMap<K extends object, V>: TS enforces object keys at compile time ──
const meta = new WeakMap<{ id: number }, string>();
const key = { id: 1 };
meta.set(key, "cached");
console.log(meta.get(key)); // cached
// meta.set("str", "x"); // TS error, not just a runtime TypeError
