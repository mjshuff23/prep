// Generators & async iteration — the TypeScript lens
// Run: npx tsx generators.ts

// ── Generator<Yield, Return, Next>: all three channels are typed ──
function* dialog(): Generator<string, boolean, number> {
  //                          ^yields  ^returns ^next() takes
  const a = yield "2 + 2 = ?"; // a: number
  const b = yield "3 * 3 = ?"; // b: number
  return a === 4 && b === 9;
}
const d = dialog();
console.log(d.next().value); // 2 + 2 = ?
console.log(d.next(4).value); // 3 * 3 = ?
console.log(d.next(9).value); // true
// d.next("wrong"); // TS error: string is not number — the Next channel is checked

// ── Yield-only generators: Generator<T> (Return/Next default to any/undefined-ish) ──
function* naturals(): Generator<number> {
  let n = 1;
  while (true) yield n++;
}

// ── Generic lazy pipeline: Iterable in, IterableIterator out ──
function* take<T>(it: Iterable<T>, n: number): IterableIterator<T> {
  let i = 0;
  for (const v of it) {
    if (i++ >= n) return;
    yield v;
  }
}
function* map<T, U>(it: Iterable<T>, f: (v: T) => U): IterableIterator<U> {
  for (const v of it) yield f(v);
}
console.log([...take(map(naturals(), (x) => x * x), 5)]); // [ 1, 4, 9, 16, 25 ]
// Fully lazy: only 5 squares are ever computed. (ES2025 adds Iterator helpers —
// Iterator.from(naturals()).map(x => x * x).take(5).toArray() — same idea, built in.)

// ── AsyncGenerator<Y, R, N> and for await ──
const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));
async function* pages(): AsyncGenerator<string, void, undefined> {
  const data = [["a", "b"], ["c"]];
  for (const page of data) {
    await sleep(5);
    yield* page;
  }
}
const out: string[] = [];
for await (const item of pages()) out.push(item); // item: string — inferred
console.log(out); // [ 'a', 'b', 'c' ]

// ── Iterable vs AsyncIterable in signatures: accept the right protocol ──
async function collect<T>(src: AsyncIterable<T> | Iterable<T>): Promise<T[]> {
  const result: T[] = [];
  for await (const v of src) result.push(v); // for await handles BOTH protocols
  return result;
}
console.log(await collect([1, 2, 3])); // [ 1, 2, 3 ]
console.log(await collect(pages())); // [ 'a', 'b', 'c' ]
