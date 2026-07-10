// Chapter 14 — the TypeScript lens (proxy, currying, bigint)
// Run: npx tsx misc.ts

// ── Typing a Proxy: the proxy can have a DIFFERENT type than the target ──
interface Dict {
  [key: string]: string;
}
function withDefault(target: Dict, fallback: string): Dict {
  return new Proxy(target, {
    get: (t, prop: string) => t[prop] ?? `${fallback}(${prop})`,
  });
}
const dict = withDefault({ hello: "hola" }, "??");
console.log(dict.hello, dict.bye); // hola ??(bye)

// A common trick: proxy that "implements" an interface dynamically (RPC clients):
interface Api {
  getUser(id: number): string;
  deleteUser(id: number): string;
}
const api = new Proxy({} as Api, {
  get:
    (_t, method: string) =>
    (...args: unknown[]) =>
      `${method}(${args.join(",")}) → sent over the wire`,
});
console.log(api.getUser(7)); // getUser(7) → sent over the wire
// api.notInInterface(1); // TS error — the interface constrains the proxy statically
// (This is how tRPC/Prisma clients feel typed while being 100% dynamic underneath.)

// ── Typed curry: overloads or conditional types; here's the honest simple one ──
function curry3<A, B, C, R>(
  f: (a: A, b: B, c: C) => R,
): (a: A) => (b: B) => (c: C) => R {
  return (a) => (b) => (c) => f(a, b, c);
}
const log = curry3((date: string, level: "INFO" | "ERROR", msg: string) =>
  `[${date}] ${level}: ${msg}`,
);
const todayError = log("2026-07-09")("ERROR");
console.log(todayError("connection lost")); // [2026-07-09] ERROR: connection lost
// log("x")("WARN"); // TS error — literal union survives through the curry chain

// ── bigint is its own primitive type ──
const big: bigint = 9007199254740993n;
// const bad: bigint = 1;      // TS error: number is not bigint
// const worse = big + 1;      // TS error: can't mix bigint and number — caught statically!
console.log(big + 1n); // 9007199254740994n
type Id = bigint; // DB ids that outgrow 2^53: model them as bigint end-to-end
const nextId = (id: Id): Id => id + 1n;
console.log(nextId(big)); // 9007199254740994n

// ── Template literal types + normalize: encode invariants ──
type Normalized = string & { readonly __nfc: unique symbol };
const normalize = (s: string): Normalized => s.normalize("NFC") as Normalized;
function compareUsernames(a: Normalized, b: Normalized): boolean {
  return a === b; // safe: both provably normalized
}
console.log(compareUsernames(normalize("ŝ"), normalize("ŝ"))); // true
// compareUsernames("ŝ", "ŝ"); // TS error — raw strings must pass through normalize()
