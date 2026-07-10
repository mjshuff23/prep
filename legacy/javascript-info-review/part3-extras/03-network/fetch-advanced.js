// Fetch: download progress, abort, long polling, SSE — javascript.info 3.3, 3.4, 3.10, 3.12
// Run: node fetch-advanced.js   (local server, no internet)

import { createServer } from "node:http";

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (url.pathname === "/big") {
    // chunked download for the progress demo
    res.setHeader("Content-Length", "40");
    for (let i = 0; i < 4; i++) {
      res.write("0123456789");
      await new Promise((r) => setTimeout(r, 10));
    }
    res.end();
  } else if (url.pathname === "/slow") {
    setTimeout(() => res.end("finally!"), 500); // slow — for the abort demo
  } else if (url.pathname === "/poll") {
    // long polling: the SERVER holds the request until there's data
    setTimeout(() => res.end(JSON.stringify({ msg: "event happened" })), 30);
  } else if (url.pathname === "/sse") {
    // Server-Sent Events: text/event-stream, "data:" lines, auto-reconnect protocol
    res.setHeader("Content-Type", "text/event-stream");
    res.write("data: first\n\n");
    res.write("id: 42\ndata: second\n\n");
    setTimeout(() => {
      res.write("event: custom\ndata: third\n\n");
      res.end();
    }, 20);
  }
});
await new Promise((r) => server.listen(0, r));
const base = `http://localhost:${server.address().port}`;

// ── Download progress: read the body stream chunk by chunk ──
const res = await fetch(`${base}/big`);
const reader = res.body.getReader(); // ReadableStream reader
const total = +res.headers.get("Content-Length");
let received = 0;
const chunks = [];
while (true) {
  const { done, value } = await reader.read(); // value: Uint8Array
  if (done) break;
  chunks.push(value);
  received += value.length;
  console.log(`progress: ${received}/${total}`); // 10/40 ... 40/40
}
console.log("body:", Buffer.concat(chunks).toString().length, "bytes"); // body: 40 bytes
// (Upload progress needs XMLHttpRequest in browsers — fetch can't report it... yet.)

// ── AbortController: cancelling fetch (and anything else) ──
const controller = new AbortController();
setTimeout(() => controller.abort(new Error("too slow")), 50);
try {
  await fetch(`${base}/slow`, { signal: controller.signal });
} catch (e) {
  console.log("aborted:", e.message); // aborted: too slow
}
// One controller can cancel MANY fetches (pass the same signal to each).
// AbortSignal.timeout(ms) is the shorthand for exactly this pattern:
try {
  await fetch(`${base}/slow`, { signal: AbortSignal.timeout(50) });
} catch (e) {
  console.log("timeout:", e.name); // timeout: TimeoutError
}

// ── Long polling: "server holds the request until it has news" ──
// The subscribe loop — each response immediately triggers the next request:
async function pollOnce() {
  const r = await fetch(`${base}/poll`); // hangs ~30ms until "event"
  return r.json();
}
console.log("polled:", (await pollOnce()).msg); // polled: event happened
// Real loop: while(true) { const msg = await pollOnce(); handle(msg); }
// with 502/timeout → retry. Simple, works everywhere; costs a hanging
// connection per client — fine for <1000s of clients or infrequent messages.

// ── Server-Sent Events: one-way server→client stream over plain HTTP ──
// Browsers: new EventSource(url) — auto-reconnect, Last-Event-ID, message events.
// Here we parse the wire format manually to see what EventSource abstracts:
const sse = await fetch(`${base}/sse`);
const text = await sse.text();
console.log(text.trim().split("\n\n"));
// [ 'data: first', 'id: 42\ndata: second', 'event: custom\ndata: third' ]
// EventSource vs WebSocket: SSE is one-directional, plain HTTP, auto-reconnects,
// text-only. WebSocket is bidirectional, its own protocol, binary-capable.
// Rule of thumb: notifications/feeds → SSE; chat/games/collaboration → WebSocket.

// ── WebSocket (concept — needs a ws server; API shape:) ──
// const ws = new WebSocket("wss://host/path");     // handshake via HTTP Upgrade
// ws.onopen / ws.onmessage / ws.onerror / ws.onclose
// ws.send("string or Blob or ArrayBuffer");        // frames, not streams
// ws.close(1000, "done");                          // code 1000 = normal
// Gotchas: check ws.bufferedAmount before flooding; onclose isn't called on
// network drop until timeout; use ping/pong (server side) for liveness.

server.close();
