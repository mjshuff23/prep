// Custom errors, extending Error — javascript.info 10.2
// Run: node custom-errors.js

// ── The canonical custom error ──
class ValidationError extends Error {
  constructor(message, options) {
    super(message, options); // sets .message (and .cause from options)
    this.name = this.constructor.name; // otherwise name stays "Error"
  }
}
class PropertyRequiredError extends ValidationError {
  constructor(property) {
    super(`No property: ${property}`);
    this.property = property; // structured data > string parsing
  }
}

function readUser(json) {
  let user;
  try {
    user = JSON.parse(json);
  } catch (err) {
    // ── error CAUSE chaining (ES2022): wrap without losing the original ──
    throw new ValidationError("Invalid user payload", { cause: err });
  }
  if (!user.age) throw new PropertyRequiredError("age");
  if (!user.name) throw new PropertyRequiredError("name");
  return user;
}

// instanceof works through the whole hierarchy:
try {
  readUser('{"age": 25}');
} catch (err) {
  console.log(err.name); // PropertyRequiredError
  console.log(err instanceof ValidationError, err instanceof Error); // true true
  console.log(err.property); // name
}
try {
  readUser("{ bad");
} catch (err) {
  console.log(err.message); // Invalid user payload
  console.log(err.cause instanceof SyntaxError); // true — the real story preserved
}

// ── Wrapping exceptions: low-level variety → one high-level type ──
// Callers of readUser check `instanceof ValidationError` — they don't need to know
// about SyntaxError vs PropertyRequiredError. Each layer speaks its own error language.

// ── Why `this.name = this.constructor.name` and not hardcoding? ──
class DbError extends Error {
  constructor(msg) {
    super(msg);
    this.name = this.constructor.name; // subclasses get the right name for free
  }
}
class TimeoutDbError extends DbError {}
console.log(new TimeoutDbError("slow").name); // TimeoutDbError — no extra code

// ── Pre-class-syntax footnote ──
// Extending Error with ES5 function-constructors was famously broken (message/stack
// lost) because Error allocates its own exotic object. `class ... extends Error` with
// super() is the reason it now Just Works (see ch 09: parent allocates this).

// ── Discriminating errors: instanceof vs error codes ──
// instanceof breaks across realms/serialization. Node core uses .code strings:
try {
  await import("node:fs/promises").then((fs) => fs.readFile("/no/such/file"));
} catch (err) {
  console.log(err.code); // ENOENT — survives serialization, greppable, stable API
}
// Solid libraries expose both: a class hierarchy AND a .code discriminant.

// ── Error.isError / structured fields roundup ──
const e = new Error("boom", { cause: "db down" });
console.log(e.message, "|", e.cause); // boom | db down
console.log(Object.keys(e)); // [] — message/stack/cause are non-enumerable!
console.log(JSON.stringify(e)); // {} — the classic "my logged error is empty" bug
console.log(JSON.stringify({ msg: e.message, stack: !!e.stack })); // serialize explicitly
