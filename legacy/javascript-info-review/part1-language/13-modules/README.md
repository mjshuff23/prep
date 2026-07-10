# 13 — Modules

Files: `export-import.js` · `dynamic-imports.js` · `modules.ts` · `lib/` (the imported modules)

## What a module IS

A module is a file with its own scope, always in strict mode, evaluated **once** and
cached — every importer shares the same instance. Four consequences you use daily:

1. **Singleton state for free.** A `const registry = new Map()` exported from a module
   is one shared object app-wide. That's the config/registry pattern — no class, no DI
   container needed.
2. **Live bindings.** ESM imports are *read-only views* onto the exporting module's
   bindings — if the exporter reassigns `count`, importers see the new value. (CommonJS
   copies values at `require` time; this is a genuine semantic difference, not style.)
   Writing to an import throws.
3. **Hoisted, statically analyzable imports.** `import` declarations run before
   anything else in the file and their paths must be string literals — which is what
   makes tree-shaking, bundling, and instant typo errors possible.
4. **Top-level `this` is `undefined`**, and in browsers `<script type="module">` is
   automatically deferred and CORS-constrained.

## Export/import grammar in 30 seconds

```js
export const x = 1;                    // named, inline
export { a, b as renamed };           // named, list form
export default fn;                    // one per module
import def, { a, renamed as c } from "./m.js";
import * as ns from "./m.js";         // ns.default is the default
export { x } from "./m.js";           // re-export (barrel files)
export * from "./m.js";               // re-exports all EXCEPT default
```

Node ESM needs real relative paths with extensions (`./lib/math.js`) — extensionless
imports are a bundler convenience, not the platform.

## Dynamic `import()`

An *expression* returning a promise of the namespace object — usable anywhere,
including conditionals and computed paths. This is the code-splitting primitive: load
a route/editor/chart library only when the user actually needs it. Costs: errors move
from load-time to runtime, and fully-dynamic paths defeat static analysis. Default to
static imports; use `import()` for laziness, optional deps, and fallbacks.

## TypeScript specifics

- **`import type`** (and inline `type` modifiers) mark imports that vanish at
  compile time — no runtime cost, no circular-import hazards from types.
  `verbatimModuleSyntax` makes the marking mandatory and predictable.
- **`moduleResolution`** must match your runtime: `NodeNext` for real Node ESM
  (extensions, `exports` maps), `bundler` for Vite-style tooling. Most "Cannot find
  module" pain is this knob.
- A `.ts` file with no imports/exports is a global *script*; add `export {}` to force
  module scope.

## Predict the output

```js
// lib.js
console.log("lib runs");
export let n = 0;
export const bump = () => n++;

// main.js
import { n, bump } from "./lib.js";
import * as lib from "./lib.js";
console.log(n);
bump();
console.log(n, lib.n);
```

<details>
<summary>Answers</summary>

`lib runs` (once — both import statements hit the cache), `0`, then `1 1` — both the
named import and the namespace property are live views of the same binding.

</details>
