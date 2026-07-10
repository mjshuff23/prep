// Rest/spread & recursion — the TypeScript lens
// Run: npx tsx rest-spread-recursion.ts

// ── Rest parameters are typed as arrays or TUPLES ──
function sumAll(label: string, ...nums: number[]): string {
  return `${label}: ${nums.reduce((a, b) => a + b, 0)}`;
}
console.log(sumAll("total", 1, 2, 3)); // total: 6

// Tuple rest: heterogeneous fixed shapes
function makeEvent(...args: [type: string, x: number, y: number]) {
  const [type, x, y] = args;
  return { type, x, y };
}
console.log(makeEvent("click", 10, 20)); // { type: 'click', x: 10, y: 20 }

// ── Spread into calls checks arity — the Math.max(...arr) subtlety ──
const nums = [3, 5, 1]; // type number[] — unknown length!
console.log(Math.max(...nums)); // 5 — OK because max takes ...number[]
function atan2Like(y: number, x: number) {
  return y / x;
}
const pair = [1, 2] as const; // readonly [1, 2] — length is KNOWN
console.log(atan2Like(...pair)); // 0.5
// atan2Like(...nums); // TS error: spread of unknown length into fixed 2 params

// ── Object spread creates precise intersection-ish types ──
const base = { host: "localhost", port: 5432 };
const cfg = { ...base, port: 6543, ssl: true }; // { host: string; port: number; ssl: boolean }
console.log(cfg); // { host: 'localhost', port: 6543, ssl: true }

// ── Recursive TYPES mirror recursive data ──
interface Employee {
  name: string;
  salary: number;
}
type Department = Employee[] | { [team: string]: Department };

const company: Department = {
  sales: [
    { name: "John", salary: 1000 },
    { name: "Alice", salary: 1600 },
  ],
  development: {
    sites: [{ name: "Peter", salary: 2000 }],
    internals: [{ name: "Jack", salary: 1300 }],
  },
};
function sumSalaries(dept: Department): number {
  if (Array.isArray(dept)) return dept.reduce((s, e) => s + e.salary, 0); // narrowed to Employee[]
  return Object.values(dept).reduce((s, sub) => s + sumSalaries(sub), 0); // narrowed to the map
}
console.log(sumSalaries(company)); // 5900

// ── Recursive generic types: type-level recursion has a depth limit too (~50) ──
type Flatten<T> = T extends readonly (infer U)[] ? Flatten<U> : T;
type Leaf = Flatten<number[][][]>; // number
const leaf: Leaf = 42;
console.log(leaf); // 42

// Linked list, generically:
interface ListNode<T> {
  value: T;
  next: ListNode<T> | null;
}
const list: ListNode<number> = { value: 1, next: { value: 2, next: null } };
function toArray<T>(node: ListNode<T> | null): T[] {
  return node ? [node.value, ...toArray(node.next)] : [];
}
console.log(toArray(list)); // [ 1, 2 ]
