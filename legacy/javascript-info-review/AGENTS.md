# AGENTS.md — Build Plan & Progress for javascript-info-review

This file lets any agent (or a fresh Claude session) resume the build. **Update the
Progress checklist whenever a chapter is finished.**

## Goal

A self-contained review repo so Michael can refresh JavaScript to intermediate/expert
level, structured after https://javascript.info. Each chapter folder contains:

- `README.md` — prose explanations of concepts better taught in human language
  (mental models, WHY things work), a per-article gotcha checklist, and 3–5
  **predict-the-output exercises** with answers in a `<details>` block at the bottom.
- Per-article `.js` files — runnable top-to-bottom with `node file.js`, sectioned with
  `// ── Section ──` banners, expected output in trailing comments, 3–6 gotcha-driven
  demos per article with WHY comments.
- Matching `.ts` files — NOT mechanical translations; show what TypeScript adds/catches
  for the same concepts (typed `this`, generics, `unknown` in catch, discriminated
  unions, typed DOM event maps, `satisfies`, ...). Must pass strict `tsc --noEmit`.
  Run with `npx tsx file.ts`.
- DOM-bound chapters additionally get self-contained `.html` playgrounds (inline
  script, open directly or via `npx serve`).

## Scope (user-confirmed)

- Part 1 core language, chapters 4–14 (SKIP ch2 Fundamentals and ch3 Code Quality)
- Part 2 Browser/DOM — all chapters
- Part 3 Additional articles — all chapters
- Depth: focused gotcha examples + predict-the-output exercises (not exhaustive)

## Directory layout

```
part1-language/
  04-objects-basics/        object-references, this, constructors-new, optional-chaining,
                            symbols, object-to-primitive (GC covered in README)
  05-data-types/            primitives-methods, numbers, strings, arrays, iterables,
                            map-set, weakmap-weakset, object-keys-values, destructuring,
                            date, json
  06-advanced-functions/    recursion, rest-spread, closures, global-object,
                            function-object-nfe, new-function, scheduling,
                            call-apply-decorators, bind, arrow-functions
  07-property-config/       property-flags-descriptors, getters-setters
  08-prototypes/            prototypal-inheritance, f-prototype, native-prototypes,
                            prototype-methods
  09-classes/               class-syntax, inheritance-super, static, private-protected,
                            extending-builtins, instanceof, mixins
  10-error-handling/        try-catch, custom-errors
  11-promises-async/        callbacks, promise-basics, chaining, error-handling,
                            promise-api, promisification, microtasks, async-await
  12-generators-iteration/  generators, async-iteration
  13-modules/               intro, export-import, dynamic-imports
  14-misc/                  proxy-reflect, eval, currying, reference-type, bigint,
                            unicode-strings, weakref-finalization
part2-browser/
  01-document/  02-events/  03-ui-events/  04-forms/  05-resource-loading/  06-misc/
  (HTML playgrounds + typed-DOM .ts; event-loop article in 06-misc is Node-runnable)
part3-extras/
  01-frames-windows/ (README-heavy)  02-binary-data/  03-network/  04-storage/
  05-animation/  06-web-components/  07-regex/
```

## Tooling

- `package.json`: `"type": "module"`, scripts `check` (tsc --noEmit), `serve`.
  Dev deps: typescript, tsx, @types/node. Keep it lean — nothing else.
- `tsconfig.json`: strict, ES2023 + DOM libs, NodeNext, noEmit,
  noUncheckedIndexedAccess, includes the three part dirs.
- Verify with `npm run check`; spot-run `.js` with node and `.ts` with `npx tsx`,
  confirming printed output matches the output comments.

## Execution order

1. ✅ Scaffold: package.json, tsconfig, dirs, AGENTS.md, root README
2. Part 1 chapters 04–08
3. Part 1 chapters 09–14
4. Part 3 Node-runnable: 07-regex, 03-network, 02-binary-data
5. Part 2 browser chapters + Part 3: 01-frames-windows, 04-storage, 05-animation,
   06-web-components
6. Final pass: root README index complete, `npm run check` clean, spot-runs

## Progress checklist (keep updated!)

- [x] Scaffold (package.json, tsconfig, directory tree, AGENTS.md)
- [x] Root README (index + how-to-run; finalize links in final pass)
- [x] part1-language/04-objects-basics (verified: node runs + tsc clean)
- [x] part1-language/05-data-types (verified)
- [x] part1-language/06-advanced-functions (verified)
- [x] part1-language/07-property-config (verified)
- [x] part1-language/08-prototypes (verified)
- [x] part1-language/09-classes (verified)
- [x] part1-language/10-error-handling (verified)
- [x] part1-language/11-promises-async (verified)
- [x] part1-language/12-generators-iteration (verified)
- [x] part1-language/13-modules (verified)
- [x] part1-language/14-misc (verified) — ALL OF PART 1 DONE
- [x] part3-extras/07-regex (verified)
- [x] part3-extras/03-network (verified)
- [x] part3-extras/02-binary-data (verified)
- [x] part2-browser/01-document (playground.html + dom.ts + README; tsc clean)
- [x] part2-browser/02-events (playground.html + events.ts + README; tsc clean)
- [x] part2-browser/03-ui-events (playground.html + README; no .ts by design — typing covered in 02's events.ts)
- [x] part2-browser/04-forms (playground.html + README)
- [x] part2-browser/05-resource-loading (playground.html + README; tsc clean)
- [x] part2-browser/06-misc (playground.html + event-loop.js/.ts + README; node/tsx runs + tsc clean)
- [x] part3-extras/01-frames-windows (playground.html + README)
- [x] part3-extras/04-storage (playground.html + README)
- [x] part3-extras/05-animation (playground.html + README)
- [x] part3-extras/06-web-components (playground.html + README)
- [x] Final verification: `npm run check` clean; spot-ran event-loop.js/.ts and regex.js/.ts;
      served 3 playgrounds with `npm run serve`; confirmed root README links all resolve

## Format conventions established (match these when finishing)

- Browser chapters got ONE self-contained `playground.html` per CHAPTER (not per
  article as originally planned) — interactive numbered <section>s per article topic,
  vanilla inline script, log helper writing to <output> elements, heavy WHY comments.
- Chapter README: prose mental models + gotcha tables + "Predict the output/behavior"
  exercises with answers in <details> at the bottom.
- .ts files: what TypeScript adds for that domain (typed event maps, querySelector
  generics, etc.), must pass strict `npx tsc --noEmit` (noUncheckedIndexedAccess is ON).
- After writing a chapter: run its .js with node, `npx tsc --noEmit`, run .ts with tsx,
  fix any output-comment mismatches, then tick the checklist here.
