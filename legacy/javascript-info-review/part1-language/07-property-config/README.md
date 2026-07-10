# 07 — Object properties configuration

Files: `property-flags-descriptors` · `getters-setters` (each in `.js` and `.ts`)

## The hidden machinery under every property

Every property you've ever written is secretly a **descriptor** with three flags
besides its value:

| Flag | When `false`... |
|---|---|
| `writable` | assignment fails (silently, or `TypeError` in strict mode) |
| `enumerable` | invisible to `for..in`, `Object.keys`, spread, `JSON.stringify` |
| `configurable` | can't `delete`, can't change flags again — **a one-way door** |

Normal assignment (`obj.x = 1`) creates all-`true` properties.
`Object.defineProperty` defaults every unspecified flag to **`false`** — the #1
surprise in this chapter. This machinery explains built-in behavior you've seen for
years: `Math.PI` can't be reassigned (`writable:false`), `toString` doesn't show up in
loops (`enumerable:false`), and some host properties can't be deleted
(`configurable:false`). The only relaxation allowed on a non-configurable property is
flipping `writable` from `true` to `false` — tightening only.

Object-level locks stack up: `preventExtensions` (no adding) ⊂ `seal` (+ no
deleting/reconfiguring) ⊂ `freeze` (+ no writing). **All shallow.**

Spread and `Object.assign` copy only *enumerable* props and read through getters —
`Object.defineProperties({}, Object.getOwnPropertyDescriptors(src))` is the
flag-faithful clone.

## Accessor properties: the other kind

A property is *either* a data property (`value` + `writable`) *or* an accessor
(`get`/`set`) — never both. Accessors let functions masquerade as plain values, which
buys you three things:

1. **Computed values** — `fullName` derived from parts, always fresh.
2. **Validation** — a setter that throws on bad input, with a backing field
   (`_x` by convention, `#x` for real privacy in classes).
3. **API evolution without breakage** — a data property can become computed later and
   no caller changes. This is the deep reason accessors exist: they make property
   access an *abstraction*, not a memory read.

Costs: a getter runs on **every read** (keep it cheap, no side effects), and a getter
without a setter makes assignment fail — silently in sloppy code, `TypeError` in
strict, compile error in TS.

TS mapping: `writable:false` ≈ `readonly` (but `readonly` is erased at runtime — one
cast defeats it, so use `Object.freeze` for hard guarantees); `as const` is the *deep*
compile-time freeze; getter-only class members are statically read-only; setters may
accept wider types than getters return (TS 4.3+).

## Gotcha checklist

- [ ] `defineProperty` defaults flags to `false`; assignment defaults them to `true`
- [ ] `configurable:false` is permanent — even `defineProperty` can't undo it
- [ ] freeze/seal/`Readonly<T>`/`as const`: know which are shallow (first three) vs deep (`as const`)
- [ ] Spread skips non-enumerables and collapses accessors to their current values
- [ ] Getters run per-read; side effects in getters are debugging hell
- [ ] `readonly` in TS is compile-time only

## Predict the output

```js
// 1
const o = {};
Object.defineProperty(o, "x", { value: 1, enumerable: true });
o.x = 2;
console.log(o.x, Object.keys(o));

// 2
const src = { get val() { return Math.random(); } };
const copy = { ...src };
console.log(copy.val === copy.val);

// 3
const frozen = Object.freeze({ list: [1] });
frozen.list.push(2);
console.log(frozen.list.length);

// 4
const u = {
  first: "A", last: "B",
  get full() { return this.first + this.last; },
};
delete u.full;
console.log(u.full);
```

<details>
<summary>Answers</summary>

1. `1 [ 'x' ]` — `writable` defaulted to `false`, so `o.x = 2` failed (in a module it
   actually throws `TypeError`; in sloppy code it's silent).
2. `true` — spread *reads* the getter once and stores a plain data value; `copy.val`
   is a frozen random number, not a live getter.
3. `2` — freeze is shallow; the array object inside is unfrozen.
4. `undefined` — literal-defined accessors are configurable, so `delete` removes the
   whole accessor property; reading a missing property gives `undefined`.

</details>
