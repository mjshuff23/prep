# Part 3.3 — Network requests

Files: `fetch-basics.js` · `fetch-advanced.js` · `network.ts` — each spins up a local
`node:http` server, so everything runs offline.

## fetch: the three facts people get wrong

1. **HTTP errors don't reject.** A 404 or 500 *fulfills* the promise — `fetch` rejects
   only on network-level failure (DNS, connection refused, CORS block). Check
   `res.ok`/`res.status` yourself, always.
2. **The body is a one-shot stream.** `res.json()`, `res.text()`, `res.blob()` — pick
   one, once; a second read throws. For progress or streaming, read
   `res.body.getReader()` chunk by chunk (each chunk a `Uint8Array`).
3. **Two awaits.** `await fetch()` resolves at *headers received*; the body arrives
   during the second `await res.json()`.

`AbortController` is the cancellation story: pass `controller.signal`, call
`controller.abort(reason)` — one controller can cancel many fetches, and
`AbortSignal.timeout(ms)` packages the timeout pattern. The signal mechanism is
generic; your own async code can accept signals too.

Use `URL`/`URLSearchParams` instead of string concatenation — encoding is handled and
reversible. `encodeURIComponent` (escapes `& = ? #`) is for *values*; `encodeURI` for
whole URLs. `FormData` builds `multipart/form-data` bodies and sets the boundary
header for you.

## CORS (concept — browser-only, no code file)

The Same-Origin Policy blocks scripts from *reading* cross-origin responses.
CORS is the opt-in protocol servers use to relax it:

- **"Simple" requests** (GET/POST/HEAD, basic headers, form content types) are sent
  immediately; the browser then checks `Access-Control-Allow-Origin` on the response
  before letting your code see it. The request *reached the server* either way —
  CORS protects reading, not sending.
- **Everything else** (PUT/DELETE, `Content-Type: application/json`, custom headers)
  triggers a **preflight**: an `OPTIONS` request asking permission
  (`Access-Control-Request-Method/Headers`), answered by `Access-Control-Allow-*`
  headers, cached via `Access-Control-Max-Age`.
- Credentials (cookies) need `credentials: "include"` *and* server
  `Access-Control-Allow-Credentials: true` with an explicit (non-`*`) origin.
- Response headers beyond a safe list are hidden unless `Access-Control-Expose-Headers`
  names them.

The historical WHY: pre-CORS pages could already *send* cross-origin requests (forms,
scripts), so that stayed allowed; *reading* was never allowed and required explicit
opt-in. Node's `fetch` has no SOP — CORS is a browser concept.

## Choosing a server-push mechanism

| | Long polling | SSE (`EventSource`) | WebSocket |
|---|---|---|---|
| Direction | server→client (per request) | server→client stream | bidirectional |
| Transport | plain HTTP | plain HTTP | own protocol (Upgrade) |
| Reconnect | you write it | automatic (+`Last-Event-ID`) | you write it |
| Data | anything | text events | text + binary |
| Use for | simple/rare events | feeds, notifications, LLM token streams | chat, games, collab editing |

`XMLHttpRequest` remains relevant for one thing fetch can't do: **upload progress**
events. Otherwise it's legacy. Resumable uploads = server stores bytes received, client
asks and continues from that offset (protocols like tus formalize it).

TS lens: `res.json()` is `Promise<any>` — the second-biggest type hole after
`JSON.parse`. Wrap fetch once: check `res.ok`, parse as `unknown`, validate with a
type guard (or zod) into a real type, and throw a typed `HttpError` otherwise.

## Predict the output

```js
// 1
const res = await fetch("https://example.com/definitely-404");
console.log("did we get here?");

// 2
const r = await fetch(url);
const a = await r.json();
const b = await r.json();

// 3
const p = new URLSearchParams({ next: "/a?b=1&c=2" });
console.log(p.toString());
console.log(new URLSearchParams(p.toString()).get("next"));
```

<details>
<summary>Answers</summary>

1. `did we get here?` prints — 404 fulfills. (It would reject only if the *network*
   failed.)
2. `b` throws `TypeError: Body is unusable / already read` — one-shot stream.
3. `next=%2Fa%3Fb%3D1%26c%3D2`, then `/a?b=1&c=2` — URLSearchParams encodes and
   decodes symmetrically; hand-building the string would have broken on the `&`.

</details>
