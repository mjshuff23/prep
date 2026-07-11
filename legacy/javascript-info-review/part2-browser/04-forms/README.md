# Part 2.4 — Forms, controls

Files: `playground.html` · `playground.js` · `playground.ts` (4 interactive sections)

## Navigation & values

`document.forms.name` → form; `form.elements.name` → control; `control.form` → back.
Radios with one name group into a `RadioNodeList` whose `.value` is the checked one.
The value lives in different places per control — the table that prevents dumb bugs:

| Control | Read/write |
|---|---|
| text/textarea | `.value` (never `textarea.innerHTML` — that's the initial markup) |
| checkbox/radio | `.checked` (`.value` is just the submit-payload string) |
| select | `.value`, `.selectedIndex`, or per-`option.selected` (multi-select) |

`new FormData(form)` harvests everything submittable in one go (named, non-disabled
fields; unchecked checkboxes are *absent*, not false) — `Object.fromEntries(fd)` for a
quick object, or pass the `FormData` straight to `fetch` as a body.

## Focus

`focus`/`blur` **don't bubble** — for delegation use `focusin`/`focusout` (or capture
phase). `document.activeElement` tells you who has focus. `tabindex="0"` makes any
element part of keyboard navigation, `-1` = focusable by script only (avoid positive
values — they hijack tab order). Focus loss is a debugging classic: removing the
focused element, `alert()`s, or `blur()` in handlers all silently drop focus.

## input vs change vs beforeinput

- **`input`** — fires on *every* value modification (typing, paste, drag-drop),
  after the fact, not cancelable.
- **`change`** — fires on *commit*: blur for text controls, immediately for
  select/checkbox/radio.
- **`beforeinput`** (and `keydown`) — where you *can* cancel/filter input.
- Clipboard: `cut/copy/paste` events with `event.clipboardData`, cancelable.

## submit

Two triggers: submit-type button click and Enter in a text field (which also
synthesizes a click on the submit button). The modern SPA pattern is
`submit → preventDefault → new FormData(form) → fetch` — keeping Enter-to-submit and
built-in validation working, which click-handlers-on-buttons silently lose.
`form.submit()` (the method) bypasses both the event *and* validation. The Constraint
Validation API (`required`, `minlength`, `type=email` + `checkValidity()`,
`el.validity`, `setCustomValidity()`) covers most validation without a library.

## Predict the behavior

1. `<textarea>hello</textarea>`; the user types "bye"; what do `.value` and
   `.innerHTML`-equivalent (its text content) say?
2. A change listener on a `<select>` vs an `<input type="text">` — when does each fire?
3. A form has `<input name="agree" type="checkbox">` unchecked —
   what does `FormData` contain for it?
4. You attach `form.addEventListener("blur", ...)` to track field exits. Works?

<details>
<summary>Answers</summary>

1. `.value` is `"bye"`-edited text; the element's text content still says `hello` —
   it's the *initial* value only.
2. Select: immediately on choosing an option. Text input: only when it loses focus
   (or Enter in some browsers).
3. Nothing — unchecked checkboxes are omitted entirely (the eternal backend surprise).
4. No — blur doesn't bubble. Use `focusout` or `{capture: true}`.

</details>
