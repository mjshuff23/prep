# Part 2.3 — UI Events

Files: `playground.html` · `playground.js` · `playground.ts` (5 interactive sections)

## Mouse events

Order for a double-click: `mousedown → mouseup → click → mousedown → mouseup → click →
dblclick`. `event.button` (0 left, 1 middle, 2 right), modifier flags
(`shiftKey/ctrlKey/altKey/metaKey` — use `metaKey` for Mac-friendly hotkeys).
Coordinates come in pairs: `clientX/Y` (viewport) vs `pageX/Y` (document). Prevent
text selection on dblclick with `mousedown → preventDefault`, and the context menu via
`contextmenu → preventDefault`.

## mouseover/out vs mouseenter/leave

The pair everyone confuses. `mouseover/out` **bubble** and re-fire for every child
boundary crossed (with `relatedTarget` saying where from/to); `mouseenter/leave` fire
**once** per entry/exit of the element itself and don't bubble — which also means
**they can't be delegated**. For delegated hover logic (table cells, menu items), use
`mouseover` + `closest()`. Edge cases worth knowing: `relatedTarget` can be `null`
(came from outside the window), and fast mouse moves can skip intermediate elements.

## Pointer events: the modern default

`pointer*` events mirror `mouse*` but unify mouse, touch, and pen: `pointerId`,
`pointerType` ("mouse"/"touch"/"pen"), `isPrimary`, plus pressure/tilt. Two
superpowers over mouse events:

1. **`setPointerCapture(pointerId)`** — routes all subsequent pointer events to one
   element until release, making drag implementations trivially self-contained (no
   `document`-level move/up listeners, no "lost the element" bugs).
2. Multi-touch is representable (one stream per `pointerId`).

For dragging you also need CSS `touch-action: none` (stop the browser panning) and
`user-select: none`. The drop-target trick: the dragged element sits under the cursor,
so *hide it momentarily* and ask `document.elementFromPoint(x, y)` what's beneath.
Native HTML5 drag'n'drop (`dragstart/dragover/drop` + `preventDefault` on `dragover`)
remains the tool for dragging *into/out of* the page (files, other windows).

## Keyboard

`event.key` is the *meaning* (layout-dependent: `"z"`, `"Z"`, `"я"`); `event.code` is
the *physical key* (`"KeyZ"`, layout-independent). Hotkeys usually want `code` (same
finger position on QWERTZ/AZERTY) — but beware: `code` differs across keyboard form
factors. Auto-repeat sets `event.repeat`. Defaults preventable per key (arrows
scrolling, etc.) — but OS-level combos (Alt+F4) are out of reach.

## Scrolling

`scroll` fires per frame *after* the scroll happened (it's not cancelable — prevent
scrolling at the source: `wheel`/`keydown` instead). Always register scroll/wheel
listeners `{passive: true}` (default for touch in modern Chrome) and throttle work
with `requestAnimationFrame`. For "element entered viewport" logic, skip scroll math
entirely — `IntersectionObserver` (see ch 2.6 README) is cheaper and cleaner.

## Predict the behavior

1. A `mouseenter` listener on `<ul>`, and the mouse moves from `<li>A</li>` to
   `<li>B</li>` — how many events?
2. During a pointer-capture drag, the cursor moves over a sibling element. Who
   receives `pointermove`?
3. Hotkey check `e.key === "z"` with Shift held — fires?

<details>
<summary>Answers</summary>

1. Zero — `mouseenter` fired once when entering the `<ul>`; child-to-child moves are
   invisible to it (`mouseover` would fire).
2. The capturing element — that's the whole point of `setPointerCapture`.
3. No — Shift makes `e.key === "Z"`. Compare lowercased, or use `e.code === "KeyZ"`.

</details>
