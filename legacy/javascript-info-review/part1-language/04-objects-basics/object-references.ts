// Object references and copying — the TypeScript lens
// Run: npx tsx object-references.ts

// TS types describe SHAPES, not identity — the reference semantics are identical.
// What TS adds: `readonly` and `Readonly<Type>` to make "const-ness" reach into objects.

interface Dimensions {
  w: number;
  h: number;
}
interface User {
  name: string;
  dimensions: Dimensions;
}

const user: User = { name: "Ann", dimensions: { w: 10, h: 20 } };

// ── `const` vs `readonly`: const stops rebinding; readonly stops mutation ──
const frozen: Readonly<User> = user;
// frozen.name = "Bea"; // TS error: Cannot assign to 'name' (read-only)
// ...but Readonly is SHALLOW, same as the runtime spread gotcha:
frozen.dimensions.w = 99; // compiles! dimensions itself isn't readonly
console.log(user.dimensions.w); // 99

// A DeepReadonly must be built recursively (or use a lib):
type DeepReadonly<Type> = { readonly [Key in keyof Type]: DeepReadonly<Type[Key]> };
const deepFrozen: DeepReadonly<User> = user;
// deepFrozen.dimensions.w = 1; // TS error now — the mapped type recursed

// ── readonly is COMPILE-TIME only; Object.freeze is runtime (also shallow) ──
const cfg = Object.freeze({ debug: false, nested: { x: 1 } });
// cfg.debug = true;   // TS error AND silently ignored at runtime (throws in strict mode)
cfg.nested.x = 2; // freeze is shallow too — this works
console.log(cfg.nested.x); // 2

// ── structuredClone is typed: it returns the same Type ──
const clone: User = structuredClone(user);
clone.dimensions.h = 1;
console.log(user.dimensions.h, clone.dimensions.h); // 20 1

// ── Structural typing gotcha: two different objects, same type, equal never ──
const a = { name: "x" };
const b = { name: "x" };
console.log(a === b); // false — TS can't save you from reference equality
// TS even flags comparisons it can prove are wrong, e.g. between disjoint literal
// types: `if ("a" === "b")` is a compile error, but object identity is a runtime fact.
