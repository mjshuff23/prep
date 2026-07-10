// Fetch, FormData, URL objects — javascript.info 3.1, 3.2, 3.6, 3.7
// Run: node fetch-basics.js   (spins up a local server — no internet needed)

import { createServer } from "node:http";

// ── A tiny local echo server so every demo is deterministic ──
const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname === "/json") {
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ ok: true, query: url.searchParams.get("q") }));
  } else if (url.pathname === "/echo") {
    let body = "";
    for await (const chunk of req) body += chunk;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ method: req.method, contentType: req.headers["content-type"], body }));
  } else {
    res.statusCode = 404;
    res.end("not found");
  }
});
await new Promise((r) => server.listen(0, r));
const base = `http://localhost:${server.address().port}`;

// ── GET + json(): the 2-step await ──
const res = await fetch(`${base}/json?q=test`);
console.log(res.status, res.ok); // 200 true
console.log(await res.json()); // { ok: true, query: 'test' } — body is read ASYNC, once:
try {
  await res.text(); // second read of the same body
} catch (e) {
  console.log(e.constructor.name); // TypeError — body is a one-shot stream
}

// ── THE fetch gotcha: HTTP errors do NOT reject ──
const notFound = await fetch(`${base}/missing`);
console.log(notFound.ok, notFound.status); // false 404 — promise FULFILLED anyway!
// fetch rejects only on NETWORK failure (DNS, refused, CORS). Check res.ok yourself:
if (!notFound.ok) console.log("must handle manually:", notFound.status); // ... 404

// ── POST json ──
const postRes = await fetch(`${base}/echo`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "Ann" }),
});
console.log(await postRes.json());
// { method: 'POST', contentType: 'application/json', body: '{"name":"Ann"}' }

// ── FormData: multipart bodies, Content-Type set for you ──
const form = new FormData();
form.append("name", "Ann");
form.append("file", new Blob(["file-contents"], { type: "text/plain" }), "notes.txt");
const formRes = await fetch(`${base}/echo`, { method: "POST", body: form });
const echoed = await formRes.json();
console.log(echoed.contentType.startsWith("multipart/form-data; boundary=")); // true
console.log(echoed.body.includes("file-contents")); // true

// ── Response headers (iterable, case-insensitive) + request headers ──
console.log(postRes.headers.get("content-type")); // application/json
// Forbidden request headers exist in BROWSERS (Referer, Cookie, Host...) — the
// browser owns them for safety; Node's fetch is less restricted.

// ── URL objects: parse, build, and never hand-encode again ──
const u = new URL("/path/search?q=old", "https://example.com:8080");
u.searchParams.set("q", "Kürbis & co"); // encoding handled correctly
u.searchParams.append("tag", "a b");
u.hash = "#top";
console.log(u.href); // https://example.com:8080/path/search?q=K%C3%BCrbis+%26+co&tag=a+b#top
console.log(u.hostname, u.port, u.pathname); // example.com 8080 /path/search
console.log([...u.searchParams]); // [ [ 'q', 'Kürbis & co' ], [ 'tag', 'a b' ] ] — decoded back
// encodeURIComponent vs encodeURI: Component escapes & = ? # too — use it for VALUES:
console.log(encodeURI("x=a&b"), encodeURIComponent("x=a&b")); // x=a&b x%3Da%26b

server.close();
