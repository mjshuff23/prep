# 11 — Promises, async/await

Files: `promise-basics.js` · `promise-errors.js` · `promise-api.js` · `microtasks-async-await.js` · `promises.ts`

## The mental model

A promise is a **one-shot, one-way state machine**: `pending → fulfilled(value)` or
`pending → rejected(error)`. Extra `resolve`/`reject` calls are ignored. Unlike
events, subscribers attached *after* settlement still get called — a promise is a
value-over-time, not a broadcast.

`.then` returns a **new** promise resolving to whatever the handler returns — that's
what chaining is. The one rule that generates half of all promise bugs: **if the
handler returns a promise (or any thenable), the chain waits for it; if you forget the
`return`, the chain moves on immediately with `undefined`.** Multiple `.then` on the
same promise are independent subscribers, not a chain.

## Errors: the invisible try/catch

The executor and every handler run inside an implicit try/catch — synchronous `throw`
becomes rejection. Rejections **fall through** `.then` handlers until a `.catch`
(which is just `then(null, f)`). From there: *return* to recover (chain continues
fulfilled), *rethrow* to keep failing. `.finally` is pass-through cleanup — it sees no
value and can't change it (unlike `try`'s finally!). Unhandled rejections hit
`unhandledrejection`/`process.on("unhandledRejection")` — in Node they take down the
process. End every chain with `.catch`, or use `await` inside `try`.

Two asymmetries worth knowing: an **async** throw inside an executor
(`setTimeout(() => { throw ... })`) escapes the invisible try/catch — use `reject`;
and the second argument of `.then(f, g)` cannot catch errors thrown by its own `f`.

## The API zoo, by decision

| You want... | Use | Failure behavior |
|---|---|---|
| all results, all needed | `Promise.all` | fail-fast on first rejection |
| all results, partial OK | `Promise.allSettled` | never rejects; per-item status |
| first settled (timeouts) | `Promise.race` | first rejection can win |
| first success (fallbacks) | `Promise.any` | rejects only if all fail (`AggregateError`) |

All of them run inputs **in parallel** (the promises are already started); `all`
preserves input order regardless of completion order.

## Microtasks: why ordering questions have exact answers

Promise handlers go into the **microtask queue**. After the current synchronous code
finishes, the engine **drains the entire microtask queue** (including microtasks
queued *by* microtasks), and only then takes one macrotask (`setTimeout`, I/O). Hence
the catechism: `sync → all microtasks → one macrotask → (repeat)`. Even
`Promise.resolve().then(f)` never runs `f` synchronously.

## async/await

`async` marks a function as always returning a promise; `await` suspends the function
(not the thread!) and unwraps. It's the same machinery — `await p` ≈ `p.then(rest of
function)`. What it buys you: `try/catch` works on async errors again, and code reads
top-to-bottom.

The two habits that matter:

1. **Don't serialize independent work.** `await a(); await b();` takes the sum;
   start both, then `await Promise.all([pa, pb])` takes the max.
2. **`forEach(async ...)` doesn't wait** — it fires N floating promises and returns.
   Use `for..of` (sequential) or `Promise.all(arr.map(...))` (parallel).

TS lens: `Promise<T>` carries the value type but rejections are untyped;
`Awaited<T>`/`ReturnType` reflect async results; `Promise.all` preserves tuple types;
forgotten `await`s ("floating promises") type-check — you need the lint rule.

## Predict the output

```js
// 1
console.log("a");
setTimeout(() => console.log("b"));
Promise.resolve().then(() => console.log("c")).then(() => console.log("d"));
console.log("e");

// 2
Promise.resolve(1)
  .then((v) => { v + 1; })
  .then((v) => console.log(v));

// 3
Promise.reject(new Error("x"))
  .finally(() => console.log("fin"))
  .catch((e) => console.log("caught", e.message))
  .then((v) => console.log("value:", v));

// 4
async function f() {
  console.log(1);
  await null;
  console.log(2);
}
f();
console.log(3);

// 5
const p = new Promise((res) => { console.log("exec"); res("v"); });
console.log("after new");
p.then(console.log);
console.log("after then");
```

<details>
<summary>Answers</summary>

1. `a e c d b` — sync (`a`, `e`), then the whole microtask chain (`c`, `d`), then the
   macrotask (`b`).
2. `undefined` — the first handler doesn't return anything (`v + 1` is discarded).
3. `fin`, `caught x`, `value: undefined` — finally passes the rejection through;
   catch recovers returning `undefined`; the chain continues fulfilled.
4. `1 3 2` — an async function runs synchronously until the first `await`, which
   yields even for `await null`.
5. `exec`, `after new`, `after then`, `v` — the executor is synchronous; the handler
   is always a microtask.

</details>
