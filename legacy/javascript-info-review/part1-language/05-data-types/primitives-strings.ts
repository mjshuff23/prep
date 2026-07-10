// Primitives & strings — the TypeScript lens
// Run: npx tsx primitives-strings.ts

// ── string vs String: TS makes the wrapper trap a type error ──
const good: string = "x";
// const bad: string = new String("x"); // TS error: 'String' is not 'string'
console.log(typeof good); // string

// ── Template literal TYPES: strings with structure, checked at compile time ──
type Locale = `${string}-${Uppercase<string>}`;
const en: Locale = "en-US";
// const bad2: Locale = "en-us"; // TS error: lowercase region rejected
console.log(en); // en-US

type Route = `/${string}`;
function navigate(r: Route) {
  console.log("→", r);
}
navigate("/users"); // → /users
// navigate("users"); // TS error: missing leading slash

// ── Literal unions + string methods: narrowing survives ──
type Level = "debug" | "info" | "error";
function log(level: Level, msg: string) {
  // level.toUpperCase() returns "DEBUG" | "INFO" | "ERROR" (TS 4.8+ preserves literals)
  console.log(`[${level.toUpperCase()}] ${msg}`);
}
log("info", "hello"); // [INFO] hello

// ── .at() returns T | undefined — TS forces you to handle the miss ──
const t = "stringify";
const last = t.at(-1); // string | undefined
console.log(last?.toUpperCase()); // Y
// With noUncheckedIndexedAccess, t[0] is ALSO string | undefined — honest indexing.

// ── Key-manipulation types built on strings ──
interface User {
  name: string;
  age: number;
}
type Getters = { [K in keyof User as `get${Capitalize<K>}`]: () => User[K] };
// Getters = { getName: () => string; getAge: () => number }
const g: Getters = { getName: () => "Ann", getAge: () => 30 };
console.log(g.getName(), g.getAge()); // Ann 30

// ── Immutability is modeled: string has no mutating methods in lib.d.ts ──
let s = "Hi";
// s[0] = "h"; // TS error: index signature is readonly
s = "h" + s.slice(1);
console.log(s); // hi
