// Microtasks + async/await — javascript.info 11.7, 11.8
// Run: node microtasks-async-await.js

// ── The microtask queue: promise handlers NEVER run synchronously ──
Promise.resolve("done").then((v) => console.log("2:", v));
console.log("1: sync code first"); // even for already-settled promises,
// handlers go through the microtask queue → after ALL current sync code.

// ── The full ordering: sync → microtasks (drained fully) → macrotask → repeat ──
setTimeout(() => console.log("6: macrotask (setTimeout)"), 0);
Promise.resolve()
  .then(() => console.log("3: microtask 1"))
  .then(() => console.log("4: microtask 2 (queued by 1)"));
queueMicrotask(() => console.log("5: queueMicrotask"));
// microtasks queued BY microtasks still run before any macrotask — the queue drains.

// ── async/await: sugar over the exact same machinery ──
async function f() {
  return 1; // async functions ALWAYS return a promise
}
f().then((v) => console.log("7: async returns promise of", v));

const delay = (ms, v) => new Promise((r) => setTimeout(() => r(v), ms));

async function sequential() {
  const t = Date.now();
  const a = await delay(20, 1); // await = suspend HERE, yield to the event loop
  const b = await delay(20, 2); // runs only after a — total ~40ms
  return `sequential ${a + b} in ~${Date.now() - t >= 40 ? "40" : "?"}ms`;
}
async function parallel() {
  const t = Date.now();
  const pa = delay(20, 1); // start BOTH first...
  const pb = delay(20, 2);
  const [a, b] = await Promise.all([pa, pb]); // ...then await — total ~20ms
  return `parallel ${a + b} in ~${Date.now() - t < 35 ? "20" : "?"}ms`;
}
sequential().then((s) => console.log("8:", s));
parallel().then((s) => console.log("9:", s));
// THE await performance trap: sequential awaits for independent work.

// ── try/catch works again! await turns rejections into throws ──
async function withErrors() {
  try {
    await Promise.reject(new Error("rejected!"));
  } catch (e) {
    return `10: caught "${e.message}" with plain try/catch`;
  }
}
withErrors().then(console.log);

// ── A sync throw inside async fn is ALSO just a rejection ──
async function bug() {
  throw new Error("async fn throw");
}
bug().catch((e) => console.log("11:", e.message)); // 11: async fn throw

// ── await non-promises: values pass through; thenables are awaited ──
async function misc() {
  console.log("12:", await 42); // 12: 42
  console.log("13:", await { then: (r) => r("thenable") }); // 13: thenable
}
misc();

// ── Top-level await: allowed in ES modules (this file!) ──
const tl = await delay(60, "top-level await works in modules");
console.log("14:", tl);

// ── forEach + async: the classic footgun ──
async function forEachTrap() {
  const items = [1, 2, 3];
  let sum = 0;
  items.forEach(async (n) => {
    await delay(5, null);
    sum += n; // fires later; forEach didn't wait
  });
  console.log("15: after forEach, sum =", sum); // 15: ... 0 (!)
  // fixes: for..of with await (sequential), or Promise.all(items.map(...)) (parallel).
  // BONUS trap: `sum += await x` inside parallel map is a read-modify-write RACE —
  // each callback reads sum (0) BEFORE its await, so you'd get 3, not 6.
  // Return values and reduce instead:
  const results = await Promise.all(
    items.map(async (n) => {
      await delay(5, null);
      return n;
    }),
  );
  console.log("16: Promise.all sum =", results.reduce((a, b) => a + b, 0)); // 16: ... 6
}
await forEachTrap();
