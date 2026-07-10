// Error handling — the TypeScript lens (one file for the chapter)
// Run: npx tsx errors.ts

// ── catch variables are `unknown` (with useUnknownInCatchVariables, part of strict) ──
try {
  JSON.parse("{ bad");
} catch (err) {
  // console.log(err.message); // TS error: err is unknown — anything can be thrown!
  if (err instanceof Error) console.log(err.name); // SyntaxError — narrow first
  else console.log("non-Error thrown:", err);
}

// The reusable narrowing helper every codebase ends up with:
function toError(value: unknown): Error {
  if (value instanceof Error) return value;
  return new Error(String(value), { cause: value });
}
try {
  throw "a bare string";
} catch (e) {
  console.log(toError(e).message); // a bare string
}

// ── Typed custom errors: discriminated by class AND by literal code ──
class AppError extends Error {
  constructor(
    message: string,
    readonly code: "VALIDATION" | "NOT_FOUND" | "DB", // literal union discriminant
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = this.constructor.name;
  }
}
class ValidationError extends AppError {
  constructor(
    readonly field: string,
    options?: ErrorOptions,
  ) {
    super(`Invalid field: ${field}`, "VALIDATION", options);
  }
}
function handle(err: AppError) {
  switch (err.code) {
    case "VALIDATION":
      return `422: ${err.message}`;
    case "NOT_FOUND":
      return "404";
    case "DB":
      return "503";
    // no default needed: TS knows the union is exhausted
  }
}
console.log(handle(new ValidationError("email"))); // 422: Invalid field: email

// ── Functions that never return: the `never` type ──
function fail(msg: string): never {
  throw new AppError(msg, "DB");
}
function getPort(cfg: { port?: number }): number {
  return cfg.port ?? fail("no port configured"); // never merges away — result is number
}
console.log(getPort({ port: 8080 })); // 8080

// ── The Result pattern: errors in the return type instead of thrown ──
// TS cannot type `throws` (no checked exceptions) — Result makes failure visible:
type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

function parseJson<T>(raw: string): Result<T, SyntaxError> {
  try {
    return { ok: true, value: JSON.parse(raw) as T };
  } catch (e) {
    return { ok: false, error: e as SyntaxError };
  }
}
const r = parseJson<{ name: string }>('{"name":"Ann"}');
if (r.ok) console.log(r.value.name); // Ann — can't touch .value without checking .ok
else console.log(r.error.message);
const bad = parseJson("nope");
console.log(bad.ok); // false
// Trade-off: explicit but viral. Use for EXPECTED failures (parsing, validation);
// keep throw for bugs and truly exceptional states.

// ── assertion functions: throw-or-narrow ──
function assertDefined<T>(v: T | null | undefined, what = "value"): asserts v is T {
  if (v == null) throw new Error(`${what} is missing`);
}
const maybePort = [8080][0]; // number | undefined under noUncheckedIndexedAccess
assertDefined(maybePort, "port");
console.log(maybePort * 1); // 8080 — narrowed to number after the assert
