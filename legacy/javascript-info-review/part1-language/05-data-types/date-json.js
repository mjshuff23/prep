// Date and time + JSON methods — javascript.info 5.11, 5.12
// Run: node date-json.js

// ── Date is a timestamp (ms since 1970-01-01 UTC) with locale-flavored getters ──
const d = new Date(2026, 0, 31); // MONTHS ARE 0-INDEXED: 0 = January (!)
console.log(d.getMonth(), d.getDate(), d.getDay()); // 0 31 6 — getDay = weekday (0=Sun)
// getDate = day of month, getDay = day of week. Forever confusing. Check twice.

// ── Autocorrection: out-of-range values roll over — feature and footgun ──
console.log(new Date(2026, 0, 32).getMonth()); // 1 — Jan 32 becomes Feb 1
const plus70days = new Date(2026, 0, 1);
plus70days.setDate(plus70days.getDate() + 70); // idiomatic date math
console.log(plus70days.getMonth() + 1, plus70days.getDate()); // 3 12 — March 12
// (careful mixing toISOString with local-time constructors: ISO is UTC and can
// show the "wrong" calendar day depending on your timezone)

// The end-of-month trap:
const jan31 = new Date(2026, 0, 31);
jan31.setMonth(1); // "February 31" → rolls to March 3
console.log(jan31.getMonth()); // 2 (March!) — month math needs clamping

// ── Parsing: only ISO 8601 is reliable; anything else is engine roulette ──
console.log(new Date("2026-01-15").getTime()); // 1768435200000 — date-only ISO = UTC midnight
console.log(new Date("2026-01-15T00:00").getHours()); // 0 — with time = LOCAL. Subtle!
console.log(+new Date("not a date")); // NaN — an "Invalid Date" object

// ── Timestamps and benchmarking ──
console.log(Date.now() > 1.7e12); // true — no allocation, use for timing
// performance.now() gives sub-ms monotonic time — immune to clock adjustments.

// ── JSON.stringify: what silently DISAPPEARS ──
const obj = {
  str: "s",
  n: 1,
  fn() {}, // dropped
  undef: undefined, // dropped
  sym: Symbol("x"), // dropped
  [Symbol("k")]: "v", // dropped (symbol KEY)
  nan: NaN, // → null
  inf: Infinity, // → null
  date: new Date(0), // → ISO STRING (via Date.prototype.toJSON)
  nested: { map: new Map([["a", 1]]) }, // Map → {} (!!)
};
console.log(JSON.stringify(obj));
// {"str":"s","n":1,"nan":null,"inf":null,"date":"1970-01-01T00:00:00.000Z","nested":{"map":{}}}

// ── Round-trip is LOSSY: dates come back as strings ──
const back = JSON.parse(JSON.stringify({ when: new Date(0) }));
console.log(typeof back.when); // string — not a Date anymore

// The reviver fixes it during parse:
const revived = JSON.parse('{"when":"1970-01-01T00:00:00.000Z"}', (key, value) =>
  key === "when" ? new Date(value) : value,
);
console.log(revived.when.getUTCFullYear()); // 1970 — (getFullYear() is LOCAL time
// and would print 1969 west of Greenwich — the local-vs-UTC getter trap in action)

// ── replacer + toJSON: controlling output ──
const room = { number: 23, occupiedBy: null };
const meetup = { title: "Conf", room };
room.occupiedBy = meetup; // circular!
console.log(
  JSON.stringify(meetup, (key, value) => (key === "occupiedBy" ? undefined : value)),
); // {"title":"Conf","room":{"number":23}} — replacer breaks the cycle
console.log(JSON.stringify({ n: 7, toJSON: () => "custom" })); // "custom"

// ── Pretty printing ──
console.log(JSON.stringify({ a: { b: 1 } }, null, 2)); // indented 2 spaces
