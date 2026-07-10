// Regex — the TypeScript lens
// Run: npx tsx regex.ts

// ── match/exec results are honest about failure: null and undefined everywhere ──
const m = "2026-07-09".match(/(\d{4})-(\d{2})/); // RegExpMatchArray | null
// console.log(m[1]); // TS error: m is possibly null
console.log(m?.[1]); // 2026 — and [1] is string | undefined (groups may not match)

// ── Named groups type as Record<string, string> | undefined — no key checking ──
const d = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/.exec("2026-07-09");
if (d?.groups) {
  console.log(d.groups.year); // 2026 — but d.groups.yaer would ALSO compile (any key!)
}
// Fix: validate + narrow into a real type at the boundary:
interface DateParts {
  year: string;
  month: string;
  day: string;
}
function parseDate(s: string): DateParts | null {
  const r = /^(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})$/.exec(s);
  if (!r?.groups) return null;
  const { year, month, day } = r.groups;
  if (!year || !month || !day) return null;
  return { year, month, day }; // from here on, typo-proof and undefined-free
}
console.log(parseDate("2026-07-09")); // { year: '2026', month: '07', day: '09' }
console.log(parseDate("07/09/2026")); // null

// ── Template literal types: compile-time "regex" for simple shapes ──
type IsoDate = `${number}-${number}-${number}`;
const good: IsoDate = "2026-07-09";
// const bad: IsoDate = "July 9"; // TS error — rejected at compile time, zero runtime cost
console.log(good); // 2026-07-09
// They can't express real character classes or lengths — pair them with a runtime
// regex (branded type from ch 14) when the format matters for correctness.

// ── replace with a function: params are typed loosely — annotate what you use ──
const csv = "name;age;city".replace(/;/g, () => ",");
console.log(csv); // name,age,city
const doubled = "5 apples, 3 pears".replace(/\d+/g, (match: string) =>
  String(Number(match) * 2),
);
console.log(doubled); // 10 apples, 6 pears

// ── matchAll returns IterableIterator<RegExpExecArray> — lazy, spread to realize ──
const years = [..."2024, 2025, 2026".matchAll(/\d{4}/g)].map((r) => r[0]);
console.log(years); // [ '2024', '2025', '2026' ]

// ── Runtime validation belongs in type guards ──
function isHexColor(s: string): s is `#${string}` {
  return /^#[0-9a-f]{6}$/i.test(s);
}
const input: string = "#ff8800";
if (isHexColor(input)) console.log("valid color", input); // valid color #ff8800
