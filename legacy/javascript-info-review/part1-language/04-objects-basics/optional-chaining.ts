// Optional chaining — the TypeScript lens
// Run: npx tsx optional-chaining.ts

// TS is where ?. shines: the type system TELLS you where you need it,
// and narrowing removes the need for it after a check.

interface User {
  name: string;
  address?: { street: string; zip?: string };
}
const user: User = { name: "Ann" };

// console.log(user.address.street); // TS error: 'address' is possibly 'undefined'
console.log(user.address?.street); // undefined — TS type: string | undefined

// ── Narrowing: after a guard, ?. becomes unnecessary (and lint-flagged) ──
if (user.address) {
  console.log(user.address.street); // TS knows address is defined here
}

// ── ?? with types: the result drops null/undefined from the union ──
const street: string = user.address?.street ?? "(none)"; // string, not string | undefined
console.log(street); // (none)

// ── Gotcha: optional property (?) vs union with undefined are almost alike ──
interface A {
  x?: number;
} // may be absent
interface B {
  x: number | undefined;
} // must be PRESENT, may be undefined
const a: A = {}; // OK
// const b: B = {};              // TS error: property 'x' is missing
const b: B = { x: undefined }; // must write it explicitly
console.log("x" in a, "x" in b); // false true — runtime difference too!
// (exactOptionalPropertyTypes makes TS even stricter about this distinction)

// ── Optional call ?.() types the function itself as possibly absent ──
interface Handlers {
  onSave?: (id: number) => void;
}
function save(h: Handlers) {
  h.onSave?.(42); // one-liner replaces `if (h.onSave) h.onSave(42)`
}
save({ onSave: (id) => console.log("saved", id) }); // saved 42
save({}); // (nothing — no crash)

// ── Non-null assertion `!` is the escape hatch — it LIES to the compiler ──
// const risky = user.address!.street; // compiles fine… and throws TypeError at runtime
// Prefer ?. + ?? or a real check. `!` is for cases you can PROVE non-null.
