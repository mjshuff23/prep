// Error handling with promises — javascript.info 11.4
// Run: node promise-errors.js

// ── The invisible try..catch: throws in executors and handlers become rejections ──
new Promise(() => {
  throw new Error("from executor");
}).catch((e) => console.log("1:", e.message)); // 1: from executor

Promise.resolve(1)
  .then(() => {
    throw new Error("from handler");
  })
  .catch((e) => console.log("2:", e.message)); // 2: from handler

// ── ...but ONLY for synchronous throws. Async throws inside executors escape: ──
// new Promise((resolve) => setTimeout(() => { throw new Error("lost"); }, 5));
// ^ would be an uncaught exception — the invisible try/catch is not time-traveling.
// Rule: inside executors, call reject(err) for async failures.

// ── .catch anywhere: errors FALL THROUGH handlers until caught ──
Promise.reject(new Error("early"))
  .then((v) => v + 1) // skipped
  .then((v) => v + 1) // skipped
  .catch((e) => console.log("3:", e.message)); // 3: early

// ── Rethrow to keep failing; return to RECOVER ──
Promise.reject(new Error("db down"))
  .catch((e) => {
    if (e.message === "db down") return "cache hit"; // handled → chain turns fulfilled
    throw e; // not ours → keep propagating
  })
  .then((v) => console.log("4:", v)); // 4: cache hit

// ── catch → then ordering matters ──
Promise.reject(new Error("x"))
  .catch(() => "recovered")
  .then((v) => console.log("5:", v)); // 5: recovered
// .then(...).catch(...) vs .catch(...).then(...): catch first = recovery path;
// catch last = handles errors from ALL steps above it.

// ── .finally: pass-through cleanup (unlike try's finally, it can't override) ──
Promise.resolve("value")
  .finally(() => console.log("6: cleanup (no args seen)")) // gets NO value/error
  .then((v) => console.log("7:", v)); // 7: value — passed through untouched

// ── then(onFulfilled, onRejected) 2nd arg vs .catch: subtle difference ──
Promise.resolve(1).then(
  () => {
    throw new Error("handler bug");
  },
  () => console.log("never: 2nd arg does NOT catch its sibling's throw"),
);
// ^ that error needs a LATER .catch; with none it's an unhandled rejection... so:
process.once("unhandledRejection", (reason) => {
  console.log("8: unhandledRejection:", reason.message); // 8: ... handler bug
});
// Browser equivalent: window.addEventListener("unhandledrejection", e => ...)
// Node default WOULD crash the process for this. Always end chains with .catch.
