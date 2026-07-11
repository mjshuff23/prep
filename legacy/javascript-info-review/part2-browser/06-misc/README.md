# Part 2.6 - Miscellaneous browser APIs

Files: `playground.html` · `playground.js` · `playground.ts` (MutationObserver + Selection/Range) - `event-loop.js` - `event-loop.ts`

## MutationObserver

`MutationObserver` is the modern replacement for old DOM mutation events. It watches a
target node and delivers a batch of `MutationRecord`s after the current JavaScript turn
finishes. That "after" matters: if you append a node and immediately read your own
state, the observer callback has not run yet.

Observer options are explicit:

| Option | Watches |
|---|---|
| `childList` | children added/removed |
| `attributes` | attribute changes |
| `characterData` | text-node changes |
| `subtree` | descendants too, not just the target |
| `attributeOldValue` / `characterDataOldValue` | previous values |

Use observers for integration boundaries: watching content produced by another widget,
detecting DOM inserted by a browser extension, or measuring changes after rendering.
Do not use them as your normal state-management system; if your own code made the
change, update your own state directly.

## Selection and Range

`Selection` is what the user has selected in the document. `Range` is the lower-level
object that stores two boundary points: start container/offset and end
container/offset.

The gotcha is that a range is not just a copied string. It points into live DOM nodes.
If those nodes move, split, or get removed, the browser adjusts or collapses the range.
That is why rich text editors usually keep a separate document model instead of
treating DOM selection as the whole source of truth.

Common moves:

- `window.getSelection()` gets the active selection.
- `selection.rangeCount` tells whether there is a range.
- `document.createRange()` creates a programmatic range.
- `range.setStart(node, offset)` / `setEnd(...)` define boundaries.
- `range.extractContents()`, `cloneContents()`, `insertNode()`, and
  `surroundContents()` edit around the selected DOM.

## Event loop: macrotasks and microtasks

The browser and Node both run JavaScript in turns:

1. Run one macrotask (script start, timer callback, I/O callback, event callback).
2. Drain the entire microtask queue (`Promise.then`, `queueMicrotask`, `await`
   continuations).
3. In browsers, optionally render.
4. Take the next macrotask.

`await` does not keep running inline. Even `await null` splits the function and
continues later as a microtask. Promise handlers and `queueMicrotask` callbacks share
the same microtask queue. Timers wait until that queue is empty, which means recursive
microtasks can starve rendering and timers.

## Predict the output/behavior

```js
// 1
const div = document.createElement("div");
new MutationObserver(() => console.log("observer")).observe(div, { childList: true });
div.append("x");
console.log("sync");

// 2
setTimeout(() => console.log("timeout"), 0);
Promise.resolve().then(() => console.log("promise"));
queueMicrotask(() => console.log("microtask"));
console.log("script");

// 3
async function f() {
  console.log("a");
  await null;
  console.log("b");
}
f();
console.log("c");
```

<details>
<summary>Answers</summary>

1. `sync`, then `observer` - observer delivery is asynchronous and microtask-like.
2. `script`, `promise`, `microtask`, `timeout` - sync first, then microtasks in the
   order queued, then the timer macrotask.
3. `a`, `c`, `b` - `await` splits the function even when the awaited value is already
   available.

</details>
