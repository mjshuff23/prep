# Part 3.4 - Storing data in the browser

Files: `playground.html` (cookies, Web Storage, IndexedDB)

## Cookies

Cookies are old, small, and request-oriented. They are sent to the server on matching
HTTP requests, so they are useful for server-visible state such as sessions, but a bad
place for large client-only data.

Cookie details that matter:

| Attribute | Why it matters |
|---|---|
| `Expires` / `Max-Age` | without one, the cookie is session-scoped |
| `Path` / `Domain` | controls which requests include it |
| `Secure` | send only over HTTPS |
| `HttpOnly` | server-only; JavaScript cannot read it |
| `SameSite` | reduces cross-site request forgery risk |

`document.cookie` is a strange API: reading returns one string containing visible
cookies; writing appends/replaces one cookie rather than replacing the whole string.
You cannot set `HttpOnly` from JavaScript.

## localStorage and sessionStorage

Web Storage is synchronous key/value storage for strings.

- `localStorage` persists across browser restarts for the same origin.
- `sessionStorage` lives for one top-level tab/session.
- The `storage` event fires in other same-origin windows, not the window that made the
  change.

Because it is synchronous, do not put large blobs or hot-path writes in Web Storage.
For structured or larger data, use IndexedDB.

## IndexedDB

IndexedDB is the browser's transactional object database. It is verbose because it is
event-based, but the model is simple:

1. Open a named database with a version.
2. Create object stores during `onupgradeneeded`.
3. Start a transaction.
4. Use an object store.
5. Resolve work when the request/transaction completes.

Use IndexedDB for offline caches, drafts, large records, and anything that needs
indexes or transactions. Wrap it in promises in application code; the raw API is too
easy to nest into callback soup.

## Predict the behavior

1. `document.cookie = "a=1"; document.cookie = "b=2";` What does reading
   `document.cookie` show?
2. Does `localStorage.setItem("x", "1")` in one tab fire a `storage` event in that
   same tab?
3. What type comes back from `localStorage.getItem("count")`?
4. When can IndexedDB object stores be created?

<details>
<summary>Answers</summary>

1. Both visible cookies, usually as a string like `"a=1; b=2"`. Cookie writes set one
   cookie; they do not replace the whole cookie jar.
2. No. It fires in other same-origin windows/tabs.
3. `string | null`. Web Storage stores strings only.
4. During a version-change upgrade, inside `onupgradeneeded`.

</details>
