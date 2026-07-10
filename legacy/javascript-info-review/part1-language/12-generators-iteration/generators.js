// Generators — javascript.info 12.1
// Run: node generators.js

// ── function*: a function that can pause. Calling it runs NOTHING yet ──
function* generateSequence() {
  console.log("  started");
  yield 1;
  yield 2;
  return 3; // return value has done:true — most consumers IGNORE it
}
const gen = generateSequence(); // no output — just a paused generator object
console.log(gen.next()); //   started / { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }
console.log(gen.next()); // { value: 3, done: true } ← return value
console.log(gen.next()); // { value: undefined, done: true } — exhausted forever

// ── Generators are iterable — but for..of DROPS the return value ──
console.log([...generateSequence()]); //   started / [ 1, 2 ] — no 3! (done:true excluded)

// ── The killer app: writing iterables as straight-line code ──
const range = {
  from: 1,
  to: 5,
  *[Symbol.iterator]() {
    for (let v = this.from; v <= this.to; v++) yield v; // vs 15 lines of next() boilerplate
  },
};
console.log([...range]); // [ 1, 2, 3, 4, 5 ]

// ── yield* : delegate to another generator (composition) ──
function* gen1() {
  yield* [1, 2]; // works on any iterable
}
function* gen2() {
  yield 0;
  yield* gen1();
  yield 3;
}
console.log([...gen2()]); // [ 0, 1, 2, 3 ]

// ── Two-way street: yield RETURNS what the caller passes to next() ──
function* dialog() {
  const answer = yield "2 + 2 = ?"; // pause, hand out question, wait for reply
  console.log("  got:", answer);
  const second = yield "3 * 3 = ?";
  console.log("  got:", second);
}
const d = dialog();
console.log(d.next().value); // 2 + 2 = ? (first next() just starts it — its arg is ignored)
console.log(d.next(4).value); //   got: 4 / 3 * 3 = ?
d.next(9); //   got: 9
// This "send values in" ability is how async/await was originally implemented:
// libraries drove generators, feeding awaited results back via next(result).

// ── gen.throw / gen.return: inject errors, force cleanup ──
function* guarded() {
  try {
    yield "working";
  } catch (e) {
    console.log("  caught inside generator:", e.message);
    yield "recovered";
  } finally {
    console.log("  finally always runs"); // ← cleanup on early exit too
  }
}
const g = guarded();
g.next();
console.log(g.throw(new Error("injected")).value); //   caught... / recovered
g.return("stop"); //   finally always runs — for..of `break` calls this under the hood

// ── Practical: infinite lazy sequences ──
function* pseudoRandom(seed) {
  let value = seed;
  while (true) {
    value = (value * 16807) % 2147483647;
    yield value;
  }
}
const rand = pseudoRandom(1);
console.log(rand.next().value, rand.next().value, rand.next().value);
// 16807 282475249 1622650073 — reproducible, lazy, O(1) memory
