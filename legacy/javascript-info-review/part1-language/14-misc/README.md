# 14 — Miscellaneous

Files: `proxy-reflect.js` · `currying.js` · `misc-oddities.js` (eval, Reference Type, BigInt, Unicode, WeakRef) · `misc.ts`

## Proxy & Reflect

A `Proxy` wraps an object and intercepts its *fundamental operations* — get, set,
`in`, `delete`, enumeration, calls, construction — via trap handlers. Untrapped
operations forward transparently. This is the machinery behind Vue 3 reactivity, MobX,
Prisma/tRPC's "typed but dynamic" clients, and mocking tools.

`Reflect` mirrors every trap with a same-signature function; inside a trap,
`Reflect.get(target, prop, receiver)` is the correct "now do the default thing". The
`receiver` argument is the subtle part: it keeps inherited *getters* running with
`this` = the actual object, not the proxy target. Traps also have *invariants*
(e.g. `set` must return `true`/`false`; you can't report a non-configurable property
as absent) — violate them and you get `TypeError`s.

Known holes: built-ins with internal slots (`Map`, `Date`, private `#fields`) break
through naive proxies because their methods need the real object (bind them in the
`get` trap); and `proxy !== target` breaks identity-keyed code.

## Currying vs partial application

**Currying** transforms `f(a,b,c)` into `f(a)(b)(c)` (the practical `curry()` keeps
both call styles working, using `func.length` — so it needs fixed-arity functions).
**Partial application** just fixes some leading args of any function. Currying earns
its keep when APIs put *stable config first, varying data last* — then every
intermediate call is a useful specialized function (`log(date)(level)` →
`todayError`). That argument order is why FP libraries take the collection last.

## The four oddities, one paragraph each

- **eval**: direct `eval` sees (and pins!) the local scope; *indirect* eval
  (`(0, eval)(...)` or an alias) runs global-only. CSP blocks it, JITs hate it,
  injection loves it. `new Function` is the contained alternative.
- **Reference Type**: `obj.method()` works because the property access evaluates to a
  spec-internal *(base, name)* reference and the call consumes the base as `this`.
  Any other operation — assignment, ternary, `||`, comma — collapses it to a bare
  function, losing `this`. This is the formal answer to every "why did `this`
  disappear" question. (Parens alone don't collapse it: `(obj.method)()` still works.)
- **BigInt**: exact arbitrary-size integers, `123n`. No implicit mixing with `number`
  (`1n + 1` throws — and TS catches it statically), integer division truncates,
  `JSON.stringify` throws on it. Use for 64-bit IDs and money-in-cents at scale.
- **Unicode internals**: strings are UTF-16 code units; code points above the BMP take
  two (`"𝒳".length === 2`), and *grapheme* ≠ code point (combining marks). Two
  visually identical strings can compare unequal — `.normalize("NFC")` before
  comparing or hashing user input. Iteration (`[...s]`, `for..of`) is
  code-point-aware; indexing isn't.

## WeakRef & FinalizationRegistry

`new WeakRef(obj).deref()` gives you the object *if it's still alive* — the reference
doesn't keep it alive. `FinalizationRegistry` calls back *sometime, maybe* after
collection. Both exist for memory-sensitive caches interfacing with external resources.
The rule: GC is unobservable by design — never build program *logic* on these; reach
for `WeakMap`/`WeakSet` first.

## Predict the output

```js
// 1
const p = new Proxy({}, { get: (t, k) => k.toString().toUpperCase() });
console.log(p.hello, "x" in p);

// 2
const user = { name: "A", hi() { console.log(this?.name); } };
(user.hi)();
(true && user.hi)();

// 3
console.log(typeof 1n, 2n ** 64n > Number.MAX_SAFE_INTEGER);

// 4
console.log("café".length === "café".normalize().length);
```

<details>
<summary>Answers</summary>

1. `HELLO false` — the get trap fabricates values, but `in` uses the (untrapped) `has`,
   and the target really is empty.
2. `A` then `undefined` — parens preserve the Reference; `&&` collapses it.
3. `bigint` — and the comparison is `true`: mixed bigint/number *comparisons* (`>`,
   `==`) are allowed; only arithmetic mixing throws.
4. Depends on the source encoding of the first literal — which is exactly the point.
   If it was `e` + combining accent, lengths are 5 vs 4 → `false`. Never trust
   un-normalized strings.

</details>
