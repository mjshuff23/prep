# Part 2.2 — Introduction to Events

Files: `playground.html` (4 interactive sections) · `events.ts`

## The dispatch model: three phases

Every event travels **root → target (capturing)**, arrives (**target**), then
**target → root (bubbling)**. Handlers default to the bubbling phase;
`{capture: true}` opts into the way down. Almost all events bubble (`focus`, `blur`,
`mouseenter/leave`, `load` don't — they have bubbling siblings: `focusin/out`,
`mouseover/out`).

The two identities on every event — the eternal interview question:

- **`event.target`** — where it *actually happened* (deepest element). Constant
  through the whole flight.
- **`event.currentTarget`** (= `this` in non-arrow handlers) — whose handler is
  *currently running*.

Control flow: `stopPropagation()` halts the journey (later phases/ancestors);
`stopImmediatePropagation()` also stops *other handlers on the same element*;
`preventDefault()` is **independent** — it cancels the browser's built-in action
(navigation, form submit, checkbox toggle) but the event keeps propagating.
Architectural rule: stopping propagation is usually a smell — it breaks analytics and
outer delegation; prefer checking conditions in the handler.

## Delegation: the pattern that pays rent

Put **one** listener on a container; use `event.target.closest(selector)` to find
which logical item was hit. Wins: works for elements added later, O(1) listeners
instead of O(n), less memory, less wiring. The `closest` + `contains` pair handles
nested markup (icons inside buttons) correctly — plain `e.target === btn` doesn't.
This single pattern powers menus, tables, infinite lists, and most framework event
systems internally.

`addEventListener` options worth knowing: `once: true` (self-removing),
`passive: true` (promise not to `preventDefault` — unblocks scroll performance on
`wheel`/`touchmove`), and `signal` (an `AbortSignal` that mass-removes listeners —
the modern cleanup story, replacing kept references for `removeEventListener`).

## Custom events

`new CustomEvent(type, { detail, bubbles, cancelable })` + `el.dispatchEvent(ev)`
sends your own events through the same pipeline. The three stumbling blocks:
**`bubbles` defaults to `false`** (your document-level listener hears nothing);
`dispatchEvent` runs handlers **synchronously**; and `dispatchEvent` returns `false`
iff a listener called `preventDefault()` on a cancelable event — that's how you let
listeners veto ("hide-prevented" patterns).

TS lens (see `events.ts`): handler parameter types are inferred from the event-name
literal via `HTMLElementEventMap`; `e.target` is `EventTarget | null` by design
(narrow with `instanceof` — which is exactly the delegation pattern); augment
`DocumentEventMap` to get typed `detail` on custom events.

## Predict the behavior

```html
<div id="a"><button id="b">hi</button></div>
```
```js
a.addEventListener("click", () => console.log("a-capture"), true);
a.addEventListener("click", () => console.log("a-bubble"));
b.addEventListener("click", (e) => { console.log("b"); e.stopPropagation(); });
b.click();
```
1. What prints, in order?
2. If the `b` handler also had `once: true`, what would a second click print?
3. A checkbox's click handler calls `preventDefault()` — what does the user see?

<details>
<summary>Answers</summary>

1. `a-capture`, `b`, — then `a-bubble` is **not** printed (stopped at the target
   before bubbling up). Capture listeners upstream always ran first.
2. `a-capture`, `a-bubble` — b's handler removed itself; nothing stops propagation now.
3. The box visually un-toggles — the default action (state change) is cancelled even
   though the click event happened and propagated.

</details>
