// Modules — the TypeScript lens
// Run: npx tsx modules.ts

// ── import type: erased entirely at compile time ──
import type { User, UserId } from "./lib/user-service.ts";
// mixed form — type keyword inline:
import { createUser, VERSION, type User as U2 } from "./lib/user-service.ts";
// WHY it matters: type-only imports vanish from the emitted JS, so they can't cause
// circular-import crashes or pull code into a bundle. With `verbatimModuleSyntax`,
// TS FORCES you to mark type imports — the compiler stops guessing what's erasable.
// (NodeNext + allowImportingTsExtensions-free setups import ".js"; tsx accepts ".ts".)

const u: User = createUser("Ann");
const id: UserId = u.id;
const u2: U2 = createUser("Bea");
console.log(VERSION, u, id, u2.name); // 1.0.0 { id: 1, name: 'Ann' } 1 Bea

// ── Modules are singletons in TS too: nextId state is shared ──
console.log(createUser("Cy").id); // 3 — same module instance as above

// ── Dynamic import is typed! The namespace type comes along ──
const svc = await import("./lib/user-service.ts");
console.log(svc.createUser("Dee").name); // Dee — svc.createUser fully typed
// svc.notAThing; // TS error — even dynamic imports are checked when the path is literal

// ── Module resolution modes (the tsconfig knob that bites everyone) ──
// "moduleResolution": "NodeNext" — real Node ESM rules: extensions required,
//    package.json "exports" respected, .cts/.mts distinctions.
// "moduleResolution": "bundler" — for Vite/esbuild-style resolution: extensionless ok.
// Mismatch between your runtime and this setting = "Cannot find module" hell.

// ── Ambient/global vs module scripts ──
// A .ts file WITHOUT top-level import/export is a SCRIPT: its declarations are
// global to the project (how @types packages inject globals). Any import/export
// makes it a module with private scope. An empty `export {}` is the idiom to force
// module-hood (you'll see it in files that only declare globals plus want isolation).
export {};
