# 04 — Objects: the basics

Files: `object-references` · `this` · `constructors-new` · `optional-chaining` · `symbols` · `object-to-primitive` (each in `.js` and `.ts`)

## The mental model: variables hold references

A variable never "contains" an object. It contains a *reference* — think of it as an
address of a box somewhere in memory. Assignment (`a = b`), passing to a function, and
storing in an array all copy the **address, not the box**. Two consequences fall out:

1. **Mutation is visible through every reference.** Any code holding the reference can
   change the object everyone else sees. This is the root cause of most "spooky action
   at a distance" bugs — and why immutable patterns (spread-copy, `Object.freeze`,
   `Readonly<T>` in TS) exist.
2. **`===` compares addresses.** `{a:1} === {a:1}` is `false`. There is no built-in
   deep equality; you either compare field-by-field or use `structuredClone`-style
   libraries/tests.

`const` only locks the *variable* (the address can't be replaced). The box itself stays
mutable. Compile-time `readonly` in TS and runtime `Object.freeze` both lock properties
instead — and both are **shallow**, the same trap as spread-copying.

## Garbage collection (no code file — it's all mental model)

JavaScript memory management is automatic, based on **reachability**: a value stays in
memory while it can be reached from the "roots" (currently executing function's locals,
global variables, the call stack) by following references.

- It is *not* reference counting. Two objects pointing at each other with no path from a
  root are garbage — cycles are collected fine. (This is why old IE's ref-counting DOM
  leaked on cycles, and why the model matters.)
- The engine (V8) uses generational mark-and-sweep: most objects die young and are
  collected cheaply in the "nursery"; survivors get promoted and scanned rarely. You
  cannot force GC, only make objects unreachable.
- **You leak by keeping references**, not by forgetting to free: caches that grow
  forever, listeners never removed, closures capturing big structures. `WeakMap` /
  `WeakRef` (chapter 05 / 14) exist precisely to hold things *without* keeping them alive.

## `this`: decided at the call, not the definition

The single sentence to remember: **`this` is whatever is left of the dot at call time.**
`user.sayHi()` → `user`. `hi()` (a detached reference) → `undefined` in strict mode.
Nothing about where the function was *written* matters — except for arrow functions,
which have **no `this` at all** and transparently use the enclosing scope's. That makes
arrows perfect for callbacks inside methods, and wrong as methods themselves.

The three ways to lose `this`, and the fixes:

|         How it's lost       |                    Fix                   |
|        --------------       |                    ---                   |
| `const f = obj.method; f()` |          `obj.method.bind(obj)`          |
| `setTimeout(obj.method, 0)` |    `setTimeout(() => obj.method(), 0)`   |
| passing methods as handlers | class field arrow `method = () => {...}` |

TS extra: `this` parameters (`function f(this: User)`) make detachment a *compile*
error, and the polymorphic `this` return type keeps fluent chains working in subclasses.

## `new` in four steps

`new F(...)`: ① create `{}` linked to `F.prototype` → ② run `F` with `this` = that
object → ③ if `F` returns an **object**, return that instead → ④ otherwise return
`this`. The return-override rule (③) is obscure but real — primitives returned from a
constructor are silently ignored.

## Coercion: the hint system

Objects convert to primitives via three *hints*. The lookup order is what bites people:

- hint `"string"` (template literals, `String()`): `Symbol.toPrimitive` → `toString` → `valueOf`
- hint `"number"` (`+x`, `<`, `*`): `Symbol.toPrimitive` → `valueOf` → `toString`
- hint `"default"` (binary `+`, `==`): same order as `"number"` — **this is why
  `money + ""` uses `valueOf`, not `toString`.**

Arrays have no `valueOf` that returns a primitive, so they always fall through to
`toString` (join with commas). Every party-trick coercion (`[] + []` → `""`,
`[] == ![]` → `true`) reduces mechanically to these rules. TypeScript's answer:
operator coercion doesn't type-check, so write `Number(x)` / `String(x)` and the
whole topic becomes explicit.

## Gotcha checklist

- [ ] Spread/`Object.assign`/`Readonly`/`freeze` are all **shallow**
- [ ] `structuredClone` for deep copies (loses functions & prototypes)
- [ ] Detached methods lose `this`; arrows don't have one to lose
- [ ] Arrow as object-literal method → `this` is NOT the object
- [ ] `?.` guards only `null`/`undefined`; `||` swallows `0`, `""`, `false` — use `??`
- [ ] `?.` doesn't help with undeclared roots, and you can't assign through it
- [ ] Symbols: unique even with same description; skipped by `for..in`/JSON but copied by spread
- [ ] Binary `+` with an object uses hint `"default"` → `valueOf` first

## Predict the output

```js
// 1
const a = { n: 1 };
const b = a;
b.n = 2;
const c = { ...a, deep: { n: 3 } };
const d = { ...c };
d.deep.n = 4;
console.log(a.n, c.deep.n);

// 2
const user = {
  name: "outer",
  greet: () => console.log(this?.name),
  greet2() { setTimeout(() => console.log(this.name), 0); },
};
user.greet();
user.greet2();

// 3
function F() { this.x = 1; return { x: 2 }; }
function G() { this.x = 1; return 2; }
console.log(new F().x, new G().x);

// 4
console.log([] + [], +[], [1] + [2, 3], [2] == "2");

// 5
const obj = {
  valueOf() { return 10; },
  toString() { return "ten"; },
};
console.log(obj + 5, `${obj}`, obj == 10);
```

<details>
<summary>Answers</summary>

1. `2 4` — `a` and `b` are the same object, so `a.n` is `2`. The spread in `d` is
   shallow: `d.deep === c.deep`, so `d.deep.n = 4` shows through `c.deep.n`. (If you
   said `2 3`, that's the shallow-copy trap.)
2. `undefined`, then `outer` — the arrow `greet` has no own `this` (module scope);
   inside `greet2`, the arrow captures `this` from the method call → `user`.
3. `2 1` — returned object replaces `this`; returned primitive is ignored.
4. `"" 0 "12,3" true` — `[]`→`""`; `+[]`→0; `"1"+"2,3"`; `[2]`→`"2"` and `==` with a
   string compares `"2" == "2"`.
5. `15 "ten" true` — binary `+` and `==` use hint default → `valueOf`; template literal
   uses hint string → `toString`.

</details>
