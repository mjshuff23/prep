# 08 — Prototypes, inheritance

Files: `prototypal-inheritance.js` · `native-prototypes.js` · `prototype-methods.js` · `prototypes.ts`

## The one mechanism under all of JavaScript OOP

Every object has a hidden internal slot **`[[Prototype]]`** pointing at another object
(or `null`). Property **reads** walk up this chain until found; property **writes**
always create/modify an *own* property on the receiving object. That asymmetry is the
whole design:

- **Methods are shared, state is not.** `rabbit.walk()` finds `walk` on `animal`, but
  runs it with `this = rabbit` — `this` is always the object before the dot, never
  the object where the method was found. A thousand rabbits share one `walk` function
  and each keeps its own data.
- **Shadowing is cheap and reversible.** `rabbit.eats = false` shadows; `delete
  rabbit.eats` un-shadows.
- **One exception:** accessor properties. Assigning through an inherited *setter* runs
  the setter (with `this` = receiver) instead of creating an own data property.

The chain for an array literal: `arr → Array.prototype → Object.prototype → null`.
Native prototypes are why `[].join`, `"".toUpperCase`, and `f.bind` exist at all —
built-ins are the same mechanism, not magic.

## `F.prototype` — the worst-named property in the language

`F.prototype` is **not** `F`'s prototype. It's a plain property that is consulted
exactly once, by `new F()`, to set the *new object's* `[[Prototype]]`. Consequences:

- Reassigning `F.prototype` later doesn't touch already-created instances.
- The default `F.prototype` is `{ constructor: F }` — wholesale replacement
  (`F.prototype = {...}`) silently loses `constructor`, breaking generic code that
  does `new obj.constructor()`. Augment (`F.prototype.method = ...`) or restore it.

Class `extends` (chapter 09) builds exactly these chains: `Derived.prototype` →
`Base.prototype`, plus a second, less-known chain between the constructor *functions*
themselves (for statics).

## The modern API and the `__proto__` mess

Use `Object.create(proto, descriptors?)`, `Object.getPrototypeOf`,
`Object.setPrototypeOf`. `__proto__` is a legacy accessor that lives *on
`Object.prototype`* — kept in the spec only for web compat. Two practical corollaries:

1. **Performance:** engines optimize for stable prototype chains — set the prototype
   at creation, never `setPrototypeOf` a hot object.
2. **Security — prototype poisoning:** because `"__proto__"` as a *key* on a plain
   object hits that inherited accessor, `dict[userInput] = value` can silently
   *replace your object's prototype* instead of storing data. This scales up to the
   real-world "prototype pollution" CVE class via naive deep-merge utilities. Fixes:
   `Object.create(null)` dictionaries (no inherited anything), or better, `Map`.
   TypeScript's `Record<string, T>` will not warn you — the write type-checks fine.

Full-fidelity clone idiom (prototype + flags + getters + symbols):

```js
Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj))
```

## Touching native prototypes

Only for **polyfills** (implementing the actual spec for old engines), always with
`enumerable: false`. History lesson: MooTools' `Array.prototype.flatten` collided with
the proposed standard and the language had to rename it (`flat`) — "SmooshGate."
Method *borrowing* (`Array.prototype.join.call(arrayLike)`) is the safe way to reuse
native behavior on foreign objects.

## Gotcha checklist

- [ ] Reads climb the chain; writes are always own (except inherited setters)
- [ ] `this` = object before the dot, regardless of where the method lives
- [ ] `F.prototype` used only at `new`-time; replacing it orphans `constructor`
- [ ] `for..in` sees inherited enumerables; `Object.keys` doesn't; `in` vs `Object.hasOwn`
- [ ] `dict["__proto__"] = x` is a prototype write, not a data write
- [ ] `Object.create(null)` objects have no `toString` — and that's the point
- [ ] `setPrototypeOf` on live objects deoptimizes

## Predict the output

```js
// 1
const proto = { count: 0, inc() { this.count++; } };
const a = Object.create(proto);
const b = Object.create(proto);
a.inc(); a.inc(); b.inc();
console.log(a.count, b.count, proto.count);

// 2
function F() {}
const x = new F();
F.prototype = { late: true };
const y = new F();
console.log(x.late, y.late, x.constructor === F, y.constructor === F);

// 3
const base = { set name(v) { this._n = v.toUpperCase(); } };
const o = Object.create(base);
o.name = "ann";
console.log(o._n, Object.hasOwn(o, "name"));

// 4
const d = {};
d["__proto__"] = { admin: true };
console.log(d.admin, Object.keys(d).length);
```

<details>
<summary>Answers</summary>

1. `2 1 0` — `this.count++` reads `0` from the prototype but *writes* an own `count`
   on `a`/`b`. The shared prototype is never mutated.
2. `undefined true true false` — `x` keeps the old prototype object (with its default
   `constructor: F`); `y` gets the new one, which lacks `constructor` (falls back to
   `Object`).
3. `ANN false` — the inherited *setter* ran (creating own `_n`); no own `name` data
   property was ever created.
4. `true 0` — the assignment set the prototype (poisoning), stored nothing.

</details>
