# Part 3.1 - Frames and windows

Files: `playground.html` (popup/postMessage + clickjacking demo)

## Popups and window methods

`window.open(url, name, features)` returns a `WindowProxy` when the popup is allowed,
or `null` when the browser blocks it. Modern browsers allow popups mainly from direct
user gestures, so call it from a click handler, not from page load.

The `name` argument is not just a label. Reusing the same name reuses the same popup
window or tab if it is still open. That is useful for docs/help windows, but surprising
when you expected a fresh one every time.

Useful relationships:

| API | Meaning |
|---|---|
| `window.opener` | popup's reference back to the window that opened it |
| `popup.closed` | whether the child window has closed |
| `popup.focus()` | ask the browser to focus it |
| `window.close()` | usually works only for script-opened windows |

Security gotcha: if you open an untrusted URL, use `rel="noopener"` on links or open
with the `noopener` feature. Otherwise the new page may keep `window.opener` and try to
navigate the original tab.

## Cross-window communication

Same-origin windows can read each other's DOM. Cross-origin windows cannot. That
restriction is the Same-Origin Policy doing its job.

`postMessage` is the safe bridge:

```js
otherWindow.postMessage({ type: "hello" }, "https://trusted.example");

window.addEventListener("message", (event) => {
  if (event.origin !== "https://trusted.example") return;
  // validate event.data before trusting it
});
```

Two rules prevent most bugs:

1. Send with a specific `targetOrigin`, not `"*"`, unless the target has an opaque
   origin or the data is intentionally public.
2. On receive, check both `event.origin` and the shape of `event.data`.

`event.source` tells which window sent the message. That helps when one page talks to
several frames/popups.

## Clickjacking

Clickjacking tricks a user into clicking a real site through a transparent or disguised
frame. JavaScript frame-busting is not a defense; a hostile page can often race it,
sandbox it, or block scripts.

Defenses belong in HTTP headers:

| Defense | Use |
|---|---|
| `Content-Security-Policy: frame-ancestors 'none'` | modern, flexible framing policy |
| `X-Frame-Options: DENY` | legacy "do not frame me" |
| `X-Frame-Options: SAMEORIGIN` | legacy "only my own origin may frame me" |
| `sandbox` on iframes | restrict framed content you intentionally embed |

Do not confuse CORS with clickjacking. CORS controls whether scripts can read
cross-origin responses; frame headers control whether another page can embed your UI.

## Predict the behavior

1. `window.open()` runs inside a page-load script with no user click. What does it
   commonly return?
2. A parent calls `iframe.contentWindow.document.body` for a cross-origin frame. What
   happens?
3. A message handler accepts any `event.origin` and switches on `event.data.action`.
   What is wrong?
4. A site sets permissive CORS headers. Does that stop another site from framing it?

<details>
<summary>Answers</summary>

1. `null` in many browsers, because the popup is blocked.
2. A security error. You can keep a window reference and send messages, but you cannot
   inspect the DOM.
3. Any origin can send a forged message. Check origin and validate the payload shape.
4. No. CORS and framing are different browser security controls.

</details>
