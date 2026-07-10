# Part 2.1 — Document

Files: `playground.html` (open in a browser — 5 interactive sections) · `dom.ts`

## The DOM in one paragraph

The browser parses HTML into a tree of **nodes**: element nodes, text nodes (yes,
whitespace between tags is a node), comments. JS sees it live — change the tree, the
page changes. `document` is the entry point; everything else is navigation from there.

## Search & navigation: which tool when

- **`querySelector` / `querySelectorAll`** — CSS selectors, the default choice.
  Returns *static* results.
- **`getElementById`** — fastest single lookup.
- **`getElementsBy*`** — returns **live** `HTMLCollection`s that update as the DOM
  changes. Iterating one while inserting nodes = infinite-loop potential; this
  distinction is the classic interview trap.
- Navigation: `children`, `firstElementChild`, `nextElementSibling` etc. (the
  element-only variants — `childNodes`/`firstChild` include text nodes).
- **`closest(sel)`** — nearest ancestor matching (used constantly in event
  delegation); **`matches(sel)`** — does this element fit the selector.

## Attributes vs properties

HTML **attributes** (strings, in the markup) initialize DOM **properties** (typed,
live objects) — after that they mostly diverge. `input.getAttribute("value")` is the
*initial* value; `input.value` is what's there *now*. `href` attribute is what you
wrote; `href` property is the resolved absolute URL. Non-standard attributes don't
become properties at all — use `data-*` (surfaced as the `dataset` object) for custom
data.

## Modifying the document

Modern API: `append/prepend/before/after/replaceWith/remove` (accept nodes *and*
strings), `insertAdjacentHTML(where, html)` for markup insertion without destroying
neighbors. `innerHTML = ...` **reparses everything inside** — wiping listeners and
state, and it *executes* what it's given (event-handler attributes fire → **XSS** —
the playground demonstrates a live `onerror` payload). For untrusted text, always
`textContent`. Note: inserting an existing node *moves* it — a node can't be in two
places.

## Geometry: the three families

| Family | Measures | Notes |
|---|---|---|
| `offsetWidth/Height` | border box (content+padding+border) | 0 for `display:none` |
| `clientWidth/Height` | padding box, minus scrollbar | `clientTop/Left` = border widths |
| `scrollWidth/Height/Top/Left` | full scrollable content / current scroll | `scrollTop` is **writable** |

`getBoundingClientRect()` gives **viewport-relative** coordinates (floats, live) —
add `window.pageX/YOffset` for document coordinates. Prefer these numbers over parsing
`getComputedStyle().width` (a string, and `box-sizing` changes its meaning). Window
scrolling: `window.scrollTo/scrollBy/{behavior:"smooth"}`, `el.scrollIntoView()`.

TS lens (see `dom.ts`): `querySelector("div")` knows tag types via
`HTMLElementTagNameMap`, but class selectors return bare `Element | null` — assert
`querySelector<HTMLInputElement>` at boundaries or write a runtime-checked helper.
`style`/`dataset` are stringly-typed; geometry APIs return numeric `DOMRect`.

## Predict the behavior

1. `ul.getElementsByTagName("li").length` is saved to `n`; three `<li>` are appended;
   what is `n` and what is the collection's `.length` now?
2. `el.innerHTML += "<b>hi</b>"` — what happens to a checkbox the user had ticked
   inside `el`?
3. `getAttribute("value")` vs `.value` after the user types?
4. An element has `width: 100px; padding: 10px; border: 5px; box-sizing: content-box`.
   `offsetWidth`?

<details>
<summary>Answers</summary>

1. `n` is the old count (a number, copied), but the collection object itself now
   reports the new length — it's live.
2. It's wiped: `innerHTML +=` serializes, concatenates, and **reparses everything** —
   new checkbox, unchecked, listeners gone.
3. Attribute keeps the initial HTML value; the property has the typed text.
4. `100 + 2*10 + 2*5 = 130` (plus scrollbar width if any).

</details>
