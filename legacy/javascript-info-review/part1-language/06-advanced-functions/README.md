# 06 — Advanced working with functions

Files: `closures` · `rest-spread-recursion` · `function-objects` · `scheduling` · `decorators-call-apply` · `bind-arrows` (each in `.js` and `.ts`)

This is the highest-yield chapter for interviews. Closures, `this`, `bind`, and
decorators account for a huge share of JS questions.

## Closures: the real mental model

Forget "a function that remembers variables" — here's the mechanism. Every scope
(function call, block, module) has a **Lexical Environment**: a record of its variables
plus a link to the outer environment. Every function carries a hidden
**`[[Environment]]`** reference to the environment *where it was created*. When code
reads a variable, the engine walks that chain outward until it finds it.

Everything follows from three facts:

1. **Each call creates a fresh environment.** Two `makeCounter()` calls → two
   independent `count`s. Two functions returned from *one* call → shared state.
2. **Closures capture the variable, not its value.** The `var` loop bug
   (`[3,3,3]`) happens because all three arrows share one `i`. `let` fixes it because
   the spec creates a *new binding per iteration*.
3. **Captured environments live as long as any closure referencing them.** That's how
   private state works — and how memory leaks happen (a tiny callback pinning a huge
   parsed dataset).

`var` differences worth reciting: function-scoped (ignores blocks), hoisted with value
`undefined` (vs `let`'s Temporal Dead Zone → `ReferenceError`), tolerates
redeclaration, and in non-module scripts becomes a property of the global object.

## Functions are objects

They have `name`, `length` (declared params before the first default/rest — so
`(a, b=1, ...r) => {}` has length **1**), and can carry custom properties (unlike
closure variables, those are public and tamperable). A **Named Function Expression**
(`let f = function inner() {...}`) gives the function a private, unbreakable
self-reference — `inner` survives even if `f` is reassigned. Declarations hoist fully;
expressions and arrows don't.

`new Function("a", "return a")` compiles a string — it closes over **nothing** (global
scope only), which is intentional: it exists for genuinely dynamic code (template
engines), and is otherwise an eval-class liability.

## Scheduling

`setTimeout(f, 0)` doesn't run `f` "now" — it queues a **macrotask** that runs after
the current script *and after all pending microtasks* (promises). `setInterval`
schedules by the clock so heavy callbacks eat the gap; nested `setTimeout` guarantees a
pause *between* runs and can adapt its delay. Delays are minimums, browsers clamp
nested timers (≥4ms) and background tabs (≥1s). A pending timer retains its closure —
uncleared intervals are a canonical leak.

## Decorators, call/apply, bind — one story

A **decorator** wraps a function to add behavior (logging, caching, throttling) without
changing its interface. The universal skeleton:

```js
function decorate(fn) {
  return function (...args) {
    /* before */
    return fn.apply(this, args);   // forward `this` AND args
    /* after */
  };
}
```

`fn.apply(this, args)` (not `fn(...args)`) is the load-bearing line — it makes the
wrapper transparent for *methods*, where `this` matters. Known costs: the wrapper is a
different function (breaks `===` identity — think `removeEventListener`) and doesn't
inherit `name`/custom properties.

- **`call(ctx, a, b)` / `apply(ctx, arr)`** — invoke once with a chosen `this`.
  Also the tool for *method borrowing* (`[].join.call(arguments)`).
- **`bind(ctx, ...preset)`** — returns a new function with `this` (and leading args)
  fixed *forever*: re-`bind`, `call`, `apply` can't override it; only `new` can.
  `bind(null, x)` is partial application when `this` is irrelevant.

**Arrows are the anti-`bind`**: no own `this`, `arguments`, `super`, and no `new`. They
act entirely in their enclosing context — ideal for callbacks inside methods, wrong as
methods themselves. In classes, an arrow *field* (`onClick = () => ...`) is the
detachment-proof handler pattern, at the cost of one closure per instance.

## Gotcha checklist

- [ ] `var` in a loop + closures → all callbacks share one variable
- [ ] Two closures from the same call share state; from different calls don't
- [ ] `f.length` stops counting at the first default; rest params don't count
- [ ] `setTimeout(obj.method)` loses `this`; microtasks run before `setTimeout(f, 0)`
- [ ] Decorator wrappers must `fn.apply(this, args)` and break function identity
- [ ] `bind` is permanent; double-bind is a no-op; `new` overrides bound `this`
- [ ] Arrows: no `this`/`arguments`/`new` — capture from the enclosing scope
- [ ] TS: narrowing of mutable variables doesn't survive into async callbacks

## Predict the output

```js
// 1
function make() {
  let n = 0;
  return [() => ++n, () => ++n];
}
const [f, g] = make();
const [h] = make();
console.log(f(), g(), h());

// 2
const fns = [];
for (var i = 0; i < 2; i++) for (let j = 0; j < 2; j++) fns.push(() => `${i}${j}`);
console.log(fns.map((f) => f()).join(","));

// 3
function who() { return this?.name; }
const bound = who.bind({ name: "A" }).bind({ name: "B" });
console.log(bound.call({ name: "C" }));

// 4
console.log("start");
setTimeout(() => console.log("timeout"), 0);
Promise.resolve().then(() => console.log("promise"));
console.log("end");

// 5
function counter() { counter.n = (counter.n || 0) + 1; return counter.n; }
const alias = counter;
console.log(counter(), alias(), counter.n);
```

<details>
<summary>Answers</summary>

1. `1 2 1` — `f` and `g` share one environment (same call); `h` got a fresh one.
2. `20,21,20,21` — `var i` is shared and ends at `2`; `let j` is fresh per iteration.
3. `A` — the first bind wins; later bind/call can't re-bind.
4. `start end promise timeout` — sync code, then microtasks, then macrotasks.
5. `1 2 2` — a function property is shared state on the single function object; the
   alias is the same object.

</details>
