// Modules: export & import — javascript.info 13.1, 13.2
// Run: node export-import.js

// ── Import forms: default, named, renamed, namespace ──
import area, { PI, square, cube as cubed } from "./lib/math.js"; // default + named mix
import * as math from "./lib/math.js"; // namespace object
// Node ESM requires the ./ and the .js extension — no magic resolution like bundlers.

console.log(PI, square(3), cubed(2)); // 3.14159 9 8
console.log(area(1)); // 3.14159 (approx)
console.log(math.default === area, math.square === square); // true true

// math.js printed "[math.js evaluated]" exactly ONCE, above everything —
// imports are hoisted and the module is cached after first evaluation.

// ── Live bindings: imports are VIEWS, not copies ──
import { count, increment } from "./lib/counter.js";
console.log(count); // 0
increment();
increment();
console.log(count); // 2 (!) — a `let` binding updated in the source module shows here.
// CommonJS (require) copies the VALUE at require-time — this is a real ESM/CJS difference.
try {
  count = 99; // imports are read-only views
} catch (e) {
  console.log(e.constructor.name); // TypeError: Assignment to constant variable
}

// ── Module-level state is a singleton ──
import { registry } from "./lib/counter.js";
registry.set("app", "configured");
// ANY other module importing registry sees this entry — module cache = shared instance.
console.log(registry.get("app")); // configured

// ── Module facts (no code needed, they're ambient) ──
// 1. Modules are ALWAYS strict mode.
// 2. Top-level `this` is undefined (scripts: globalThis).
// 3. Each module has its own scope — no global variable soup.
// 4. import.meta carries module info:
console.log(import.meta.url.endsWith("export-import.js")); // true
// 5. In browsers: <script type="module">, automatically deferred, CORS-checked.

// ── Re-export (the index.js / barrel pattern) ──
// export { square } from "./lib/math.js";      // re-export named
// export { default as area } from "./lib/math.js"; // re-export default
// Gotcha: `export * from "..."` re-exports everything EXCEPT the default.

// ── Named vs default: teams increasingly prefer named-only ──
// Named exports: refactor-safe renames, IDE autoimport, no drift in what a thing
// is called across files. Defaults: fine for single-purpose modules (React comps).
