// Async iteration and generators — javascript.info 12.2
// Run: node async-iteration.js

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── Symbol.asyncIterator + for await..of: iterate values that ARRIVE over time ──
const slowRange = {
  from: 1,
  to: 3,
  [Symbol.asyncIterator]() {
    let current = this.from;
    const last = this.to;
    return {
      async next() {
        // next() returns a PROMISE of {value, done}
        await sleep(10);
        return current <= last
          ? { value: current++, done: false }
          : { value: undefined, done: true };
      },
    };
  },
};
for await (const v of slowRange) console.log("1:", v); // 1: 1 / 1: 2 / 1: 3 (10ms apart)
// NOTE: spread [...slowRange] does NOT work — spread uses the SYNC iterator only.

// ── async function*: the sane way to write the same thing ──
async function* asyncSequence(from, to) {
  for (let v = from; v <= to; v++) {
    await sleep(10);
    yield v;
  }
}
for await (const v of asyncSequence(4, 6)) console.log("2:", v); // 2: 4 / 2: 5 / 2: 6

// ── THE real-world use case: paginated APIs as one flat stream ──
async function fakeApi(page) {
  await sleep(5);
  const pages = [
    { items: ["a", "b"], next: 2 },
    { items: ["c", "d"], next: 3 },
    { items: ["e"], next: null },
  ];
  return pages[page - 1];
}
async function* allItems() {
  let page = 1;
  while (page) {
    const res = await fakeApi(page); // fetch page
    yield* res.items; // flatten items out one by one
    page = res.next; // follow pagination
  }
}
const collected = [];
for await (const item of allItems()) collected.push(item);
console.log("3:", collected); // 3: [ 'a', 'b', 'c', 'd', 'e' ]
// The consumer neither knows nor cares about pages — that's the abstraction win.
// (Same shape as GitHub's commits API example on javascript.info, minus the network.)

// ── Node streams are async iterables ──
import { Readable } from "node:stream";
const stream = Readable.from(["chunk1", "chunk2"]);
for await (const chunk of stream) console.log("4:", chunk); // 4: chunk1 / 4: chunk2
// Files too: for await (const line of readline.createInterface({input: fs.createReadStream(...)}))

// ── Early exit runs cleanup, same as sync generators ──
async function* withCleanup() {
  try {
    yield 1;
    yield 2;
  } finally {
    console.log("5: cleanup on break");
  }
}
for await (const v of withCleanup()) {
  if (v === 1) break; // triggers .return() → finally
}
// Output ends: 5: cleanup on break
