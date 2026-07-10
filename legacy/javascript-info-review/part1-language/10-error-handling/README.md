# 10 — Error handling

Files: `try-catch.js` · `custom-errors.js` · `errors.ts`

## try/catch: what it can and cannot see

`try..catch` catches **runtime, synchronous** errors. It cannot catch: syntax errors
(the script never starts), and — the big one — **errors thrown later in async
callbacks**. By the time `setTimeout`'s callback throws, the `try` block is ancient
history; the error goes straight to the global handler. Promises and `async/await`
exist largely to give async errors a propagation channel again (chapter 11).

The discipline that separates senior code:

- **Catch what you understand, rethrow the rest.** A catch block that swallows
  *every* error converts bugs into silent data corruption. Check
  `err instanceof KnownError`, handle it; otherwise `throw err`.
- **Throw `Error` objects, never strings.** Strings have no stack, no name, no
  `instanceof` story. (TS agrees: `catch (e)` types `e` as `unknown` because JS lets
  anything be thrown.)
- **`finally` runs always** — past `return`, past `throw` (it runs *before* the value
  leaves). Corollary: `return` inside `finally` **overrides** the try's return *and
  silently swallows exceptions*. Never return from finally.

## Custom errors

The pattern, memorizable in three lines:

```js
class MyError extends Error {
  constructor(message, options) { super(message, options); this.name = this.constructor.name; }
}
```

`this.constructor.name` makes every subclass self-naming. Add *structured fields*
(`this.property = ...`) instead of encoding data into message strings. Since ES2022,
`new Error(msg, { cause: original })` chains the underlying error — use it when
**wrapping exceptions**: each layer catches low-level errors and rethrows one
high-level type (`ValidationError` wrapping `SyntaxError`), so callers only need to
know *your* error vocabulary.

Practical discriminators: `instanceof` for in-process hierarchies; string `.code`
fields (Node's `ENOENT` style) when errors cross serialization or realm boundaries.
Beware: `message`/`stack`/`cause` are **non-enumerable** — `JSON.stringify(err)` gives
`{}`. Serialize explicitly.

## The TypeScript additions

- `catch (e)` is `unknown` under strict — you must narrow (`instanceof`) before use.
- There are **no checked exceptions** — a signature can't declare what it throws. The
  `Result<T, E>` discriminated-union pattern puts *expected* failures in the return
  type where the compiler enforces handling; keep `throw` for genuine bugs.
- `never` marks functions that can't return; `asserts v is T` functions narrow by
  throwing.

## Gotcha checklist

- [ ] Async callbacks escape try/catch entirely
- [ ] Swallowed rethrows: `catch` without `instanceof` filtering hides bugs
- [ ] `return` in `finally` eats exceptions
- [ ] `JSON.stringify(new Error(...))` → `{}`
- [ ] Set `name` in custom errors or they all report as "Error"
- [ ] TS: `unknown` in catch; no `throws` in signatures — consider `Result`

## Predict the output

```js
// 1
function f() {
  try { return 1; }
  finally { console.log("fin"); }
}
console.log(f());

// 2
function g() {
  try { throw new Error("x"); }
  catch (e) { return "caught"; }
  finally { return "finally"; }
}
console.log(g());

// 3
class MyErr extends Error {}
try { throw new MyErr("hi"); }
catch (e) { console.log(e.name, e instanceof MyErr, e instanceof Error); }

// 4
try {
  Promise.reject(new Error("async"));
  console.log("sync done");
} catch (e) {
  console.log("caught", e.message);
}
```

<details>
<summary>Answers</summary>

1. `fin` then `1` — finally runs before the return value is delivered.
2. `finally` — the finally return overrides the catch return.
3. `Error true true` — instanceof works, but `name` is still `"Error"` because the
   subclass never set it. The three-line pattern exists for a reason.
4. `sync done` — the rejection is asynchronous; try/catch never sees it (and the
   process reports an unhandled rejection afterward).

</details>
