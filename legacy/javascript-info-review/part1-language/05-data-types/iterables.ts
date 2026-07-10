// Iterables — the TypeScript lens
// Run: npx tsx iterables.ts

// ── The protocol has interfaces: Iterable<T>, Iterator<T>, IterableIterator<T> ──
class Range implements Iterable<number> {
  constructor(
    readonly from: number,
    readonly to: number,
  ) {}
  [Symbol.iterator](): Iterator<number> {
    let cur = this.from;
    const { to } = this;
    return {
      next: (): IteratorResult<number> =>
        cur <= to ? { value: cur++, done: false } : { value: undefined, done: true },
    };
  }
}
console.log([...new Range(1, 4)]); // [ 1, 2, 3, 4 ]

// ── Functions should ACCEPT Iterable<T>, not T[] — maximally permissive ──
function sum(xs: Iterable<number>): number {
  let total = 0;
  for (const x of xs) total += x;
  return total;
}
console.log(sum([1, 2, 3])); // 6
console.log(sum(new Range(1, 4))); // 10
console.log(sum(new Set([5, 5, 5]))); // 5 — Set dedupes, and it's iterable

// ── ArrayLike<T> is the other interface (length + indexing, no iterator) ──
const arrayLike: ArrayLike<string> = { 0: "x", 1: "y", length: 2 };
console.log(Array.from(arrayLike)); // [ 'x', 'y' ]
// Array.from is overloaded to take ArrayLike<T> | Iterable<T> — check lib.d.ts.

// ── Generators are typed Generator<Yielded, Returned, Injected> ──
function* naturals(): Generator<number, void, undefined> {
  let n = 1;
  while (true) yield n++;
}
const take = <T>(it: Iterable<T>, n: number): T[] => {
  const out: T[] = [];
  for (const v of it) {
    if (out.length === n) break;
    out.push(v);
  }
  return out;
};
console.log(take(naturals(), 3)); // [ 1, 2, 3 ]

// ── downlevelIteration note ──
// Targeting ES5, for..of over generic Iterables needs "downlevelIteration": true.
// Our target is ES2023 so iteration compiles natively.
