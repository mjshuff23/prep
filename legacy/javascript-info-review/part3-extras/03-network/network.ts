// Network — the TypeScript lens
// Run: npx tsx network.ts   (local server, no internet)

import { createServer } from "node:http";

const server = createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");
  if (req.url === "/user") res.end(JSON.stringify({ id: 1, name: "Ann" }));
  else {
    res.statusCode = 404;
    res.end(JSON.stringify({ error: "not found" }));
  }
});
await new Promise<void>((r) => server.listen(0, () => r()));
const addr = server.address();
const base = typeof addr === "object" && addr ? `http://localhost:${addr.port}` : "";

// ── response.json() returns Promise<any> — the second-biggest any-hole after JSON.parse ──
interface User {
  id: number;
  name: string;
}
const raw = await (await fetch(`${base}/user`)).json(); // any
console.log(raw.nmae); // undefined — typo compiles! `any` strikes again.

// ── The typed fetch wrapper every codebase grows ──
class HttpError extends Error {
  constructor(readonly status: number, message: string) {
    super(message);
    this.name = "HttpError";
  }
}
async function fetchJson<T>(
  url: string,
  validate: (v: unknown) => v is T, // runtime proof, not just a cast
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(url, init);
  if (!res.ok) throw new HttpError(res.status, `${init?.method ?? "GET"} ${url}`);
  const data: unknown = await res.json();
  if (!validate(data)) throw new Error(`response shape mismatch for ${url}`);
  return data;
}
const isUser = (v: unknown): v is User =>
  typeof v === "object" && v !== null &&
  typeof (v as User).id === "number" && typeof (v as User).name === "string";

const user = await fetchJson(`${base}/user`, isUser);
console.log(user.name); // Ann — typed AND verified
try {
  await fetchJson(`${base}/nope`, isUser);
} catch (e) {
  if (e instanceof HttpError) console.log(e.status); // 404 — typed error channel
}
// In real apps zod does validate+type in one schema: z.object({...}).parse(data).

// ── RequestInit / Response / Headers / URL / AbortSignal are all typed in lib.dom ──
const init: RequestInit = {
  method: "POST",
  headers: { "Content-Type": "application/json" }, // HeadersInit: record | Headers | tuples
  body: JSON.stringify({ x: 1 }),
  signal: AbortSignal.timeout(1000),
};
console.log(typeof init); // object

// ── URLSearchParams round-trip with typed entries ──
const params = new URLSearchParams({ q: "test", page: "2" });
const asObj = Object.fromEntries(params); // Record<string, string> — values are ALWAYS strings
const page = asObj.page ?? "1"; // (noUncheckedIndexedAccess: index reads may be undefined)
console.log(page + 1); // "21" (!) — string concat; the types said so. Number() it.

server.close();
