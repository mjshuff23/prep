// Numbers — the TypeScript lens
// Run: npx tsx numbers.ts

// TS has ONE number type too — it cannot catch 0.1+0.2 or precision loss.
// What it CAN do: literal types, branded units, and honest NaN-prone APIs.

// ── Numeric literal types: constrain to exact values ──
type Dice = 1 | 2 | 3 | 4 | 5 | 6;
const roll: Dice = 4;
// const bad: Dice = 7; // TS error
console.log(roll); // 4

// ── Branded units prevent unit-mixing bugs (Mars Climate Orbiter class) ──
type Meters = number & { readonly __unit: "m" };
type Feet = number & { readonly __unit: "ft" };
const m = (n: number) => n as Meters;
const ft = (n: number) => n as Feet;
function addAltitude(a: Meters, b: Meters): Meters {
  return (a + b) as Meters;
}
console.log(addAltitude(m(100), m(50))); // 150
// addAltitude(m(100), ft(50)); // TS error — different brands, same runtime number

// ── parseInt/Number return plain number — NaN is invisible to the types ──
const n = parseInt("oops"); // type: number. Value: NaN. TS can't help.
console.log(n); // NaN
// Pattern: wrap parsing so failure is IN the type:
function parseIntSafe(s: string): number | null {
  const v = Number.parseInt(s, 10);
  return Number.isNaN(v) ? null : v;
}
const parsed = parseIntSafe("42px" as string);
console.log(parsed); // 42  (parseInt reads the prefix)
console.log(parseIntSafe("px")); // null — caller MUST handle it now

// ── const assertions keep literals literal ──
const limits = { min: 0, max: 100 } as const;
// limits.max = 99; // TS error: readonly
type Max = typeof limits.max; // exactly 100, not number
const max: Max = 100;
console.log(max); // 100

// ── enum vs literal union for numeric constants ──
// Prefer literal unions or `as const` objects; numeric enums allow ANY number in
// older TS and generate runtime lookup objects. `as const` is erase-only:
const HttpStatus = { OK: 200, NotFound: 404 } as const;
type HttpStatus = (typeof HttpStatus)[keyof typeof HttpStatus]; // 200 | 404
const s: HttpStatus = 404;
console.log(s); // 404
