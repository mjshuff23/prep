# 12 — Generators, advanced iteration

Files: `generators.js` · `async-iteration.js` · `generators.ts`

## Generators: functions that pause

`function*` builds a function whose calls return a *generator object* without running
any code. Each `.next()` runs until the next `yield`, hands out
`{ value, done: false }`, and **suspends** — locals, loop counters, the whole frame
frozen in place. `return` (or falling off the end) produces `{ value, done: true }`,
and — subtle point — **`for..of` and spread discard that final value** (they stop at
`done: true`).

Generators implement the iterator protocol, which makes them *the* way to write
iterables: a `*[Symbol.iterator]()` method with a `for` loop replaces the manual
`next()` state machine from chapter 05. `yield*` delegates to any iterable —
generator composition without glue code.

The under-appreciated half: **`yield` is two-way**. `gen.next(x)` resumes the paused
generator with `x` as the *result of the yield expression*; `gen.throw(err)` resumes
by throwing at the yield point; `gen.return()` forces completion (running `finally`
blocks — this is what `break` in `for..of` triggers). Feeding results back through
`next()` is exactly how async/await was bootstrapped from generators (co, Redux-Saga).

Use cases that actually come up: lazy/infinite sequences with O(1) memory,
building iterables tersely, streaming pipelines (`take(map(...))`), reproducible
pseudo-random streams for tests.

## Async iteration

Swap `Symbol.iterator` → `Symbol.asyncIterator`, `next()` returns a **promise** of
`{value, done}`, and consume with **`for await..of`** (in async contexts/modules).
`async function*` merges both worlds: `await` for pulling data, `yield` for pushing
items out.

The canonical use case is **pagination flattening**: an async generator fetches page
after page and `yield*`s the items, so consumers see one flat stream and never learn
what a "page" is. Node streams (and `fetch` response bodies) are async iterables, so
`for await (const chunk of stream)` is idiomatic backpressure-aware reading.

Limitations worth knowing: spread `[...x]` uses only the *sync* iterator (no async
spread); an object can implement both protocols; `for await` on a plain sync iterable
works (it wraps values in promises).

TS lens: `Generator<Yield, Return, Next>` types all three channels (including what
`next()` accepts); `AsyncGenerator<Y, R, N>` likewise; accept `Iterable<T>` /
`AsyncIterable<T>` in signatures rather than concrete arrays or generators.

## Predict the output

```js
// 1
function* g() { yield 1; return 2; yield 3; }
console.log([...g()]);

// 2
function* h() { const x = yield "q"; yield x * 2; }
const it = h();
it.next(100);
console.log(it.next(21).value);

// 3
function* outer() { yield 1; yield* [2, 3]; yield 4; }
const o = outer();
o.next();
console.log(o.next().value, o.next().value, o.next().value);

// 4
function* fin() { try { yield 1; } finally { console.log("cleanup"); } }
for (const v of fin()) break;
```

<details>
<summary>Answers</summary>

1. `[1]` — `return 2` sets `done: true` (value dropped by spread); `yield 3` is
   unreachable.
2. `42` — the *first* `next(100)`'s argument is ignored (nothing is paused at a yield
   yet); `next(21)` becomes the result of `yield "q"`, so `x = 21`.
3. `2 3 4` — `yield*` inlines the array's values one per `next()`.
4. `cleanup` — `break` calls `gen.return()`, which runs `finally`.

</details>
