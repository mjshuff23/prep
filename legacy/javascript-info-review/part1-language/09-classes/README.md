# 09 — Classes

Files: `class-basics.js` · `class-inheritance.js` · `private-mixins.js` · `classes.ts`

## What `class` actually is

A class is a constructor function plus methods on its `.prototype` — chapter 08's
machinery with better syntax. But it's *not pure* sugar; classes add real semantics:
must be called with `new`, methods are non-enumerable, the body is strict mode, and
declarations live in the TDZ. Instance **fields** (`x = 1`) are assigned per-object
(own properties) top-down *before* the constructor body; **methods** go on the
prototype and are shared.

`extends` wires **two chains**: `Derived.prototype → Base.prototype` (for instances)
and `Derived → Base` (for statics — yes, the class objects themselves form a chain).

## `super`, and why derived constructors are weird

In a derived constructor, `this` **does not exist** until `super()` runs — the parent
constructor is what allocates the object. (This is what makes extending `Array`/`Error`
work: they allocate exotic objects.) Touch `this` before `super()` → `ReferenceError`.

`super.method()` is resolved **lexically** via the method's internal `[[HomeObject]]`,
set at definition time. Consequences worth knowing: `super` works only in method
shorthand (not function-valued properties), arrows inherit the enclosing method's
`super`, and you can't "re-point" super by copying methods between objects.

## Privacy: three tiers

| Mechanism | Enforced by | Survives runtime? |
|---|---|---|
| `_protected` convention | nobody | it's just a name |
| TS `private` / `protected` | compiler only | **no — erased**, visible in `Object.keys`/JSON |
| `#field` | the language | yes — syntax error outside, invisible to reflection |

`#fields` come with **brand checks**: accessing `#x` on an object that never got the
field throws, and `#x in obj` is the most forgery-proof "is this really my class?"
test (better than `instanceof`, which can be spoofed via `Symbol.hasInstance` or fail
across realms). Note `#fields` aren't accessible from subclasses at all — they're
private, not protected.

## Extending built-ins & `instanceof`

Subclassing `Array` keeps the subclass through `map`/`filter`/`slice` — they consult
`Symbol.species` to decide what to construct (override it to return plain `Array`).
`instanceof` just walks the prototype chain looking for `Cls.prototype`, and is
hookable via `Symbol.hasInstance`. For precise built-in type tags,
`Object.prototype.toString.call(x)` still beats `typeof`.

## Mixins

JS is single-inheritance, so cross-cutting behavior is *copied in*:
`Object.assign(Cls.prototype, mixin)` for simple method bags, or **subclass
factories** — `const Mixin = (Base) => class extends Base {...}` — when the mixin
needs its own constructor logic or a place in the real chain. TS types the latter with
the `new (...args: any[]) => T` constructor constraint, and the composed class carries
all members statically.

## Gotcha checklist

- [ ] Fields are own+per-instance; methods are prototype+shared; arrow fields cost a closure each
- [ ] Field initializers run in order — `a = this.b` sees `undefined` if `b` is below
- [ ] Derived ctor: `super()` before `this`, always
- [ ] TS `private` is erased — serialization and `Object.keys` expose it
- [ ] `#x` from outside is a *SyntaxError*; via `obj["#x"]` it's just a missing key
- [ ] Statics are inherited through the second chain
- [ ] `instanceof` is spoofable; `#brand in obj` isn't

## Predict the output

```js
// 1
class A { x = 1; constructor() { this.show(); } show() { console.log("A", this.x); } }
class B extends A { x = 2; show() { console.log("B", this.x); } }
new B();

// 2
class C { static who() { return this.name; } }
class D extends C {}
console.log(C.who(), D.who());

// 3
class E extends Array {}
const e = E.of(1, 2, 3).map((x) => x * 2);
console.log(e instanceof E, e.constructor.name);

// 4
class F {
  #v = 1;
  static peek(o) { try { return o.#v; } catch { return "nope"; } }
}
console.log(F.peek(new F()), F.peek({ "#v": 1 }));
```

<details>
<summary>Answers</summary>

1. `B undefined` — the parent constructor runs before B's *fields* initialize, and the
   overridden `show` (found via the prototype chain of the actual instance) runs while
   `B`'s `x` is still unset. The famous "virtual call from constructor" trap.
2. `C D` — static `this` is the class the method was *called on*; `D.who()` inherits
   the method but `this` is `D`.
3. `true "E"` — `map` uses `Symbol.species` (default: the subclass).
4. `1 "nope"` — brand check: the plain object has a string key `"#v"`, which is a
   completely different thing from the private slot; access throws, caught → `"nope"`.

</details>
