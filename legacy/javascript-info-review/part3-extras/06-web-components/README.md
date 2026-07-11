# Part 3.6 - Web components

Files: `playground.html` · `playground.js` · `playground.ts` (custom elements, Shadow DOM, slots, styling, events)

## From the orbital height

Web components are a set of browser standards for reusable elements:

| Piece | Job |
|---|---|
| Custom elements | define new tags/classes with lifecycle callbacks |
| Shadow DOM | encapsulate DOM and styles behind a shadow root |
| Templates | inert markup cloned when needed |
| Slots | let light-DOM content project into shadow DOM |

They are lower-level than React/Vue/Svelte components. Frameworks provide rendering
models and state systems; web components provide platform-level element encapsulation.

## Custom elements

Autonomous custom element names must contain a hyphen: `<review-card>`, not
`<card>`. Define once with `customElements.define(name, class)`.

Lifecycle callbacks:

| Callback | When |
|---|---|
| `connectedCallback` | inserted into the document |
| `disconnectedCallback` | removed from the document |
| `attributeChangedCallback` | observed attribute changes |
| `adoptedCallback` | moved to another document |

Use `static observedAttributes = [...]` for attributes you want to react to. Remember:
attributes are strings. Convert to numbers/booleans yourself.

## Shadow DOM, slots, and styling

`this.attachShadow({ mode: "open" })` creates an encapsulated tree. Page CSS does not
freely leak in, and shadow CSS does not freely leak out. That boundary is why web
components work across host pages.

Slots are placeholders for light-DOM children:

```html
<slot name="title"></slot>
<slot></slot>
```

Styling hooks:

- `:host` styles the custom element itself from inside the shadow tree.
- `::slotted(...)` styles assigned light-DOM nodes, but only shallowly.
- CSS custom properties cross the boundary and are the usual theming API.

## Shadow DOM and events

Events crossing a shadow boundary are retargeted. Outside listeners often see the
custom element as `event.target`, not the internal button that was clicked. Use
`event.composedPath()` when you need the actual path.

For custom events that should leave the component, set both:

```js
new CustomEvent("card-action", { bubbles: true, composed: true, detail: {...} });
```

Without `composed: true`, the event bubbles only inside the shadow tree.

## Predict the behavior

1. Can you define a custom element named `<card>`?
2. A component changes `name="Ada"` to `name="Grace"`. Which callback can respond?
3. A shadow button dispatches a custom event with `bubbles: true` but no
   `composed: true`. Does a page-level listener hear it?
4. Can page CSS directly select `.internal-button` inside a closed shadow tree?

<details>
<summary>Answers</summary>

1. No. Autonomous custom element names must contain a hyphen.
2. `attributeChangedCallback`, if `"name"` is listed in `observedAttributes`.
3. No. It bubbles inside the shadow tree but does not cross the shadow boundary.
4. No. Shadow DOM is an encapsulation boundary.

</details>
