// Date & JSON — the TypeScript lens
// Run: npx tsx date-json.ts

// ── JSON.parse returns `any` — the type-safety hole in every codebase ──
const raw = '{"name":"Ann","age":30}';
const parsed = JSON.parse(raw); // any — TS trusts you completely from here on
console.log(parsed.nmae); // undefined — typo compiles fine because it's `any`!

// Step 1: annotate as unknown, then validate:
const data: unknown = JSON.parse(raw);
function isUser(v: unknown): v is { name: string; age: number } {
  return (
    typeof v === "object" &&
    v !== null &&
    "name" in v &&
    typeof (v as Record<string, unknown>).name === "string" &&
    "age" in v &&
    typeof (v as Record<string, unknown>).age === "number"
  );
}
if (isUser(data)) console.log(data.name, data.age); // Ann 30 — safely narrowed
// (In real apps: zod/valibot generate these guards + the static type from one schema.)

// ── The serialization boundary: Date survives OUT but not BACK ──
interface Event_ {
  title: string;
  when: Date;
}
const ev: Event_ = { title: "Conf", when: new Date(0) };
const json = JSON.stringify(ev); // Date → string via toJSON
const back = JSON.parse(json) as Event_; // the `as` LIES: when is a string now!
console.log(back.when instanceof Date); // false — type says Date, runtime says string
// Model the wire format honestly instead:
type Serialized<T> = { [K in keyof T]: T[K] extends Date ? string : T[K] };
const wire = JSON.parse(json) as Serialized<Event_>; // when: string — truthful
console.log(new Date(wire.when).getUTCFullYear()); // 1970 — revive explicitly (UTC getter!)

// ── JSON-compatible types: encode "stringify won't lose this" in the type ──
type Json = string | number | boolean | null | Json[] | { [k: string]: Json };
function send(payload: Json): string {
  return JSON.stringify(payload);
}
console.log(send({ ok: true, tags: ["a"], n: 1 })); // {"ok":true,"tags":["a"],"n":1}
// send({ when: new Date() });     // TS error — Date isn't Json; forces explicit conversion
// send({ fn: () => {} });         // TS error — would silently vanish in JS

// ── Date arithmetic type quirks ──
const d1 = new Date(2026, 0, 1);
const d2 = new Date(2026, 0, 31);
// const diff = d2 - d1;            // TS error: arithmetic on Dates needs explicit intent
const diff = d2.getTime() - d1.getTime(); // the blessed form
console.log(diff / 86400000); // 30 (days)

// Temporal (stage 3, in Node 26 behind flags / polyfills) fixes the Date API:
// Temporal.PlainDate, ZonedDateTime, immutable ops, real time zones. Worth watching.
