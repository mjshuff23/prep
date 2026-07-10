# Part 2.5 - Document and resource loading

Files: `playground.html` (3 interactive sections)

## Page lifecycle

There are three different "the page loaded" moments, and mixing them up causes most
startup bugs:

| Event | What is ready | Common use |
|---|---|---|
| `DOMContentLoaded` | HTML parsed, DOM tree built | boot app code that needs elements |
| `load` | DOM plus images, stylesheets, frames, and other subresources | measurements that depend on assets |
| `beforeunload` | user is trying to leave | warn about unsaved edits |
| `unload` / `pagehide` | page is going away | best-effort analytics cleanup |

A plain script blocks parsing where it appears. If it is in `<head>`, `document.body`
can still be `null`; if it appears mid-body, elements below it do not exist yet.
That is not a race condition - it is the parser stopping to execute JavaScript.

`beforeunload` is intentionally limited. Browsers ignore custom text and require a
real user interaction before showing a prompt. For final analytics, prefer
`navigator.sendBeacon()` or `fetch(..., { keepalive: true })`; normal async work may
be killed as the page closes.

## `async`, `defer`, and modules

Script loading is about two independent choices: when the bytes download and when the
code executes.

| Script | Downloads while parsing? | Runs when? | Order preserved? |
|---|---:|---|---:|
| plain `<script>` | no, parser stops | immediately | yes, because parsing is blocked |
| `<script defer>` | yes | after parsing, before `DOMContentLoaded` | yes |
| `<script async>` | yes | as soon as it is ready | no |
| `<script type="module">` | yes | like `defer` by default | dependency graph order |

Default choice for application code: `defer` (or `type="module"`). Use `async` for
independent scripts such as analytics, where order and DOM readiness do not matter.
Dynamic scripts created with `document.createElement("script")` are async by default;
set `script.async = false` before inserting when you need ordered execution.

## Resource load/error

`onload` and `onerror` exist on scripts, images, stylesheets, and several other
resource elements. The important limitation: an error event usually tells you only
"failed", not why. A missing script, DNS failure, or blocked cross-origin script may
look the same from JavaScript.

Runtime errors inside a loaded script are different from resource load errors:

- `script.onerror` means the script file itself failed to load.
- `window.onerror` / `unhandledrejection` see errors thrown by running code.
- Cross-origin scripts without the right `crossorigin` attribute and CORS headers
  collapse details to `"Script error."`.

## Predict the behavior

1. A classic script in `<head>` logs `document.body`. What does it print?
2. A deferred script and `DOMContentLoaded` are both waiting for parsing. Which runs
   first?
3. Two async scripts are listed in order: `a.js`, then `b.js`. Which one executes
   first?
4. A dynamic script is appended and its network request returns 404. Does the promise
   wrapper reject with the HTTP status?
5. An image loads from a `data:` URL. Does `window.load` wait for it?

<details>
<summary>Answers</summary>

1. Usually `null` - the parser has not reached `<body>` yet.
2. The deferred script runs first; `DOMContentLoaded` waits for deferred scripts.
3. Whichever finishes downloading first. `async` deliberately gives up ordering.
4. It rejects if you wired `script.onerror`, but the browser usually does not expose
   the HTTP status through that event.
5. Yes. `window.load` waits for images and other subresources, even tiny `data:` ones.

</details>
