// Optional chaining '?.' — javascript.info 4.6
// Run: node optional-chaining.js

const user = { name: "Ann", address: null };

// ── ?. short-circuits on null/undefined ONLY (not on "" or 0 or false) ──
console.log(user.address?.street); // undefined — no TypeError
console.log(user?.name); // "Ann"
const zero = { count: 0 };
console.log(zero.count ?? "default"); // 0 — ?? also treats only null/undefined as missing
console.log(zero.count || "default"); // "default" — || is the classic falsy trap

// ── Short-circuit stops the WHOLE chain after it, including side effects ──
let called = 0;
const sideEffect = () => (called++, "street");
const nobody = null;
console.log(nobody?.[sideEffect()]); // undefined
console.log(called); // 0 — sideEffect never ran; evaluation stopped at nobody?.

// ── Three forms: ?.prop  ?.[expr]  ?.(args) ──
const admin = {
  greet() {
    return "hi";
  },
};
const guest = {};
console.log(admin.greet?.()); // "hi"
console.log(guest.greet?.()); // undefined — method may not exist
const key = "name";
console.log(user?.[key]); // "Ann"

// ── Gotcha: ?. does not save you if the ROOT is undeclared ──
try {
  // eslint-disable-next-line no-undef
  notDeclared?.anything;
} catch (e) {
  console.log(e.constructor.name); // ReferenceError — ?. only guards the LEFT value
}

// ── Gotcha: can't write through it ──
// user?.name = "Bea"; // SyntaxError: left side of assignment can't be ?.

// ── Don't overuse: guard only what MAY legitimately be absent ──
// user?.address?.street hides bugs if `user` must always exist —
// then a missing user should throw loudly, so write user.address?.street.
console.log(user.address?.street?.toUpperCase() ?? "(no street)"); // (no street)
