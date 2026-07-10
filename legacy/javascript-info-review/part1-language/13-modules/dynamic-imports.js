// Dynamic imports — javascript.info 13.3
// Run: node dynamic-imports.js

// ── import(path): an EXPRESSION returning a promise of the namespace object ──
const math = await import("./lib/math.js"); // [math.js evaluated] prints here (first load)
console.log(math.square(4)); // 16
console.log(math.default(1) > 3); // true — the default export is literally named "default"

// Destructure named exports (default needs renaming):
const { PI, default: area } = await import("./lib/math.js"); // cached — no re-evaluation
console.log(PI, area(2) > 12); // 3.14159 true

// ── Static import can't do this — dynamic import CAN: ──
// 1. Conditional loading:
const heavy = process.env.NEED_HEAVY === "1" ? await import("./lib/math.js") : null;
console.log(heavy); // null — the module graph stays small unless needed

// 2. Computed paths:
const which = "counter";
const mod = await import(`./lib/${which}.js`);
console.log(typeof mod.increment); // function
// (Bundlers handle template paths with limited globs; fully dynamic strings defeat
// tree-shaking and code-splitting analysis — keep patterns statically analyzable.)

// 3. Inside functions / on demand (lazy loading — THE browser use case):
async function onFirstClick() {
  const { square } = await import("./lib/math.js"); // loaded only when user acts
  return square(5);
}
console.log(await onFirstClick()); // 25

// 4. Graceful fallbacks:
const result = await import("./lib/does-not-exist.js").catch(() => ({
  fallback: true,
}));
console.log(result.fallback); // true — a missing static import would kill the process

// ── Trade-offs vs static imports ──
// Static: hoisted, analyzable (tree-shaking, bundling, typo = instant error).
// Dynamic: flexible, lazy — but errors surface at RUNTIME and tooling sees less.
// Default to static; reach for import() for code-splitting and optional deps.
