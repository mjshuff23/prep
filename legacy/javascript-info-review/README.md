# JavaScript.info Review

An intermediate/expert-level refresh of core JavaScript (and how TypeScript changes the
picture), structured after [javascript.info](https://javascript.info). Every chapter has:

- **`README.md`** — the concepts that are better explained in prose: mental models,
  the WHY behind gotchas, and predict-the-output exercises (answers at the bottom).
- **`*.js`** — runnable, annotated examples. Expected output is in trailing comments.
- **`*.ts`** — the same ideas through TypeScript's lens: what the type system adds,
  catches, or forces you to think about. All pass strict `tsc`.
- **`*.html`** — self-contained playgrounds for DOM-bound chapters (Part 2 and some
  of Part 3). Open directly in a browser or `npm run serve`.

## Setup & running

```bash
npm install
node   part1-language/06-advanced-functions/closures.js   # run a JS example
npx tsx part1-language/06-advanced-functions/closures.ts  # run a TS example
npm run check                                             # type-check everything
npm run serve                                             # serve HTML playgrounds
```

## Index

### Part 1 — The JavaScript language

| Chapter | Topics |
|---|---|
| [04 Objects: the basics](part1-language/04-objects-basics/) | references & copying, GC, `this`, `new`, optional chaining, symbols, to-primitive |
| [05 Data types](part1-language/05-data-types/) | primitive methods, numbers, strings, arrays, iterables, Map/Set, WeakMap/WeakSet, destructuring, Date, JSON |
| [06 Advanced functions](part1-language/06-advanced-functions/) | recursion, rest/spread, **closures**, function objects, scheduling, decorators & call/apply, bind, arrows revisited |
| [07 Property configuration](part1-language/07-property-config/) | property flags & descriptors, getters/setters |
| [08 Prototypes & inheritance](part1-language/08-prototypes/) | `[[Prototype]]`, `F.prototype`, native prototypes, modern prototype methods |
| [09 Classes](part1-language/09-classes/) | class syntax, `extends`/`super`, static, private `#`, extending built-ins, `instanceof`, mixins |
| [10 Error handling](part1-language/10-error-handling/) | try/catch/finally, custom & extended errors |
| [11 Promises & async/await](part1-language/11-promises-async/) | callbacks → promises, chaining, error handling, Promise API, microtasks, async/await |
| [12 Generators & advanced iteration](part1-language/12-generators-iteration/) | generators, async iteration |
| [13 Modules](part1-language/13-modules/) | module semantics, export/import forms, dynamic `import()` |
| [14 Miscellaneous](part1-language/14-misc/) | Proxy & Reflect, eval, currying, Reference Type, BigInt, Unicode internals, WeakRef |

### Part 2 — Browser: Document, Events, Interfaces

| Chapter | Topics |
|---|---|
| [01 Document](part2-browser/01-document/) | DOM tree, walking/searching, node properties, attributes vs properties, modifying, styles, sizes/scroll, coordinates |
| [02 Events](part2-browser/02-events/) | bubbling & capturing, delegation, default actions, custom events |
| [03 UI events](part2-browser/03-ui-events/) | mouse, mouseover vs mouseenter, drag'n'drop, pointer events, keyboard, scrolling |
| [04 Forms](part2-browser/04-forms/) | form navigation, focus/blur, change/input/cut/copy/paste, submit |
| [05 Resource loading](part2-browser/05-resource-loading/) | DOMContentLoaded/load/unload, async/defer scripts, onload/onerror |
| [06 Miscellaneous](part2-browser/06-misc/) | MutationObserver, Selection & Range, **event loop: micro & macrotasks** |

### Part 3 — Additional articles

| Chapter | Topics |
|---|---|
| [01 Frames & windows](part3-extras/01-frames-windows/) | popups, cross-window messaging, clickjacking |
| [02 Binary data & files](part3-extras/02-binary-data/) | ArrayBuffer & typed arrays, TextEncoder/Decoder, Blob, File/FileReader |
| [03 Network requests](part3-extras/03-network/) | fetch, FormData, progress, abort, CORS, URL, XHR, long polling, WebSocket, SSE |
| [04 Storing data](part3-extras/04-storage/) | cookies, localStorage/sessionStorage, IndexedDB |
| [05 Animation](part3-extras/05-animation/) | Bezier curves, CSS animations, requestAnimationFrame |
| [06 Web components](part3-extras/06-web-components/) | custom elements, Shadow DOM, template/slots, styling, events |
| [07 Regular expressions](part3-extras/07-regex/) | classes & flags, anchors, quantifiers, greedy vs lazy, groups, lookaround, backtracking, methods |

## Suggested review order (interview prep)

1. **06 Advanced functions** (closures, `this`, bind, decorators) — the #1 interview well
2. **11 Promises & async** + **part2-browser/06 event loop** — ordering questions
3. **08 Prototypes** → **09 Classes** — inheritance mechanics
4. **04–05 Objects & data types** — references, coercion, array methods
5. Everything else as needed.
