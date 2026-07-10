// Promise API: all / allSettled / race / any / resolve / reject — javascript.info 11.5
// Run: node promise-api.js

const delay = (ms, v) => new Promise((res) => setTimeout(() => res(v), ms));
const fail = (ms, msg) =>
  new Promise((_, rej) => setTimeout(() => rej(new Error(msg)), ms));

// ── Promise.all: parallel, order-preserving, FAIL-FAST ──
const t0 = Date.now();
Promise.all([delay(30, "a"), delay(10, "b"), delay(20, "c")]).then((results) => {
  console.log("1:", results, `~${Date.now() - t0 >= 30 ? "30" : "?"}ms`);
  // 1: [ 'a', 'b', 'c' ] ~30ms — results in INPUT order, total = slowest (parallel!)
});

// fail-fast: first rejection wins, other results are DISCARDED (but still run!)
Promise.all([delay(50, "slow"), fail(5, "boom")])
  .then(() => console.log("never"))
  .catch((e) => console.log("2:", e.message)); // 2: boom — after just 5ms

// non-promise values pass straight through:
Promise.all([delay(5, 1), 2, 3]).then((r) => console.log("3:", r)); // 3: [ 1, 2, 3 ]

// ── Promise.allSettled: wait for EVERYTHING, report each outcome ──
Promise.allSettled([delay(5, "ok"), fail(5, "nope")]).then((results) => {
  console.log("4:", results);
  // 4: [ { status: 'fulfilled', value: 'ok' },
  //      { status: 'rejected', reason: Error: nope } ]
  // The tool for "fetch 10 URLs, use whatever succeeded".
});

// ── Promise.race: first SETTLED wins — fulfilled OR rejected ──
Promise.race([delay(20, "slow win"), fail(5, "fast loss")]).catch((e) =>
  console.log("5:", e.message),
); // 5: fast loss — race is the timeout-pattern primitive:
const withTimeout = (p, ms) =>
  Promise.race([p, fail(ms, `timed out after ${ms}ms`)]);
withTimeout(delay(50, "data"), 15).catch((e) => console.log("6:", e.message)); // 6: timed out...

// ── Promise.any: first FULFILLED wins; rejections are ignored unless ALL reject ──
Promise.any([fail(5, "e1"), delay(15, "first success"), delay(30, "later")]).then((v) =>
  console.log("7:", v),
); // 7: first success
Promise.any([fail(5, "e1"), fail(10, "e2")]).catch((e) => {
  console.log("8:", e.constructor.name, e.errors.map((x) => x.message));
}); // 8: AggregateError [ 'e1', 'e2' ]

// ── resolve/reject: wrapping values (mostly for caches and API uniformity) ──
const cache = new Map();
function fetchCached(key) {
  if (cache.has(key)) return Promise.resolve(cache.get(key)); // always return a promise
  return delay(5, `data:${key}`).then((v) => (cache.set(key, v), v));
}
fetchCached("k").then(() => fetchCached("k").then((v) => console.log("9:", v))); // 9: data:k

// ── Promise.withResolvers (ES2024): the deferred pattern, built in ──
const { promise, resolve } = Promise.withResolvers();
setTimeout(() => resolve("deferred style"), 25);
promise.then((v) => console.log("10:", v)); // 10: deferred style
