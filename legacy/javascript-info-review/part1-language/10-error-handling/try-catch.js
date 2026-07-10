// Error handling: try...catch...finally — javascript.info 10.1
// Run: node try-catch.js

// ── Basics: runtime errors only, and only SYNCHRONOUS ones ──
try {
  notDefined();
} catch (err) {
  console.log(err.name, "|", err.message); // ReferenceError | notDefined is not defined
  console.log(err.stack.split("\n")[0]); // first stack line = name: message
}

// THE async gotcha: this catch never fires — the timer callback runs LATER,
// after try/catch is long gone. (Promises/async-await fix this — chapter 11.)
try {
  setTimeout(() => {
    /* throw new Error("lost!") — would crash the process, uncaught */
  }, 0);
} catch {
  console.log("never printed");
}

// ── throw: any value works, but ALWAYS throw Error objects ──
try {
  throw "just a string"; // legal... and terrible: no stack, no name
} catch (e) {
  console.log(typeof e, e instanceof Error); // string false
}

// ── Rethrowing: catch only what you understand ──
function readUser(json) {
  try {
    const user = JSON.parse(json);
    if (!user.name) throw new SyntaxError("Incomplete data: no name");
    blabla(); // unexpected bug!
    return user;
  } catch (err) {
    if (err instanceof SyntaxError) return { error: err.message };
    throw err; // NOT ours — rethrow so it surfaces loudly instead of being swallowed
  }
}
console.log(readUser("{ bad json")); // { error: "Unexpected token..." } (message varies)
try {
  readUser('{"name":"Ann"}');
} catch (e) {
  console.log("rethrown:", e.name); // rethrown: ReferenceError — the bug escaped, good
}

// ── finally: ALWAYS runs — even past return and throw ──
function withCleanup() {
  try {
    return "from try";
  } finally {
    console.log("cleanup ran"); // runs BEFORE the return completes
  }
}
console.log(withCleanup()); // cleanup ran / from try

// finally's dark side: a return in finally OVERRIDES try's return/throw:
function sneaky() {
  try {
    throw new Error("you'll never see me");
  } finally {
    // eslint-disable-next-line no-unsafe-finally
    return "finally wins"; // swallows the error entirely! Never return from finally.
  }
}
console.log(sneaky()); // finally wins

// ── catch binding is optional (ES2019) ──
try {
  JSON.parse("nope");
} catch {
  console.log("parse failed, don't care why");
}

// ── Global last-resort handlers (Node flavor) ──
process.once("uncaughtException", (err) => {
  console.log("global handler saw:", err.message); // fired after everything else
  process.exit(0); // state is unknown past this point — log and die is the rule
});
setTimeout(() => {
  throw new Error("escaped to the top");
}, 10);
// Browser equivalent: window.onerror / addEventListener("error"), plus
// "unhandledrejection" for promises.
