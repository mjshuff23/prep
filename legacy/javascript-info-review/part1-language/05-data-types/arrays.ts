// Arrays — the TypeScript lens
// Run: npx tsx arrays.ts

// ── T[] vs readonly T[] vs tuples ──
const nums: number[] = [1, 2, 3];
const frozen: readonly number[] = nums;
// frozen.push(4);   // TS error: push doesn't exist on readonly array
// frozen[0] = 9;    // TS error
console.log(frozen.length); // 3
// readonly arrays accept mutable ones, NOT vice versa — mutation is the capability.

// ── Tuples: fixed length + per-position types ──
type Point = [x: number, y: number]; // labeled tuple elements
const p: Point = [1, 2];
// const bad: Point = [1, 2, 3]; // TS error
const [x, y] = p;
console.log(x, y); // 1 2

// Variadic tuples & optional elements:
type Entry = [key: string, ...values: number[]];
const e: Entry = ["scores", 1, 2, 3];
console.log(e); // [ 'scores', 1, 2, 3 ]

// ── noUncheckedIndexedAccess: arr[i] is T | undefined — honest! ──
const first = nums[0]; // number | undefined under this flag
console.log(first?.toFixed(1)); // 1.0
// .at() is always T | undefined, flag or not.

// ── filter + type predicates: narrowing through array methods ──
const mixed: (number | null)[] = [1, null, 2, null, 3];
const onlyNums = mixed.filter((v): v is number => v !== null); // number[]
console.log(onlyNums.reduce((a, b) => a + b, 0)); // 6
// Without the `v is number` predicate, filter(Boolean) etc. keep the null in the type.

// ── reduce: the accumulator type comes from the seed — annotate it ──
const byId = [{ id: "a" }, { id: "b" }].reduce<Record<string, { id: string }>>(
  (acc, item) => ({ ...acc, [item.id]: item }),
  {},
);
console.log(Object.keys(byId)); // [ 'a', 'b' ]

// ── as const turns literals into readonly tuples — great for unions ──
const ROLES = ["admin", "editor", "viewer"] as const;
type Role = (typeof ROLES)[number]; // "admin" | "editor" | "viewer"
const r: Role = "editor";
console.log(ROLES.includes(r)); // true

// ── sort comparator is typed; toSorted keeps readonly-friendliness ──
const sorted = ROLES.toSorted(); // readonly input → new mutable array out
console.log(sorted); // [ 'admin', 'editor', 'viewer' ]
// [1, 30, 4].sort() still compiles though — lexicographic sort is a RUNTIME trap
// TS won't catch. Lint rules (e.g. require-array-sort-compare) exist for it.
