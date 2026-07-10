// Numbers — javascript.info 5.2
// Run: node numbers.js

// ── One number type: IEEE-754 double. Integers are exact only to 2^53-1 ──
console.log(Number.MAX_SAFE_INTEGER); // 9007199254740991
console.log(9007199254740992 === 9007199254740993); // true (!) — beyond safe range
console.log(Number.isSafeInteger(2 ** 53)); // false

// ── THE classic: binary floating point can't store 0.1 exactly ──
console.log(0.1 + 0.2); // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3); // false
console.log(0.1 + 0.2 - 0.3 < Number.EPSILON); // true — epsilon comparison
console.log(+(0.1 + 0.2).toFixed(2)); // 0.3 — or round for display
// For money: use integer cents, or BigInt, or a decimal library. Never floats.

// ── toFixed returns a STRING (and rounds with surprises) ──
console.log(typeof (1.5).toFixed(1)); // string
console.log((1.35).toFixed(1)); // 1.4 (looks fine)
console.log((6.35).toFixed(1)); // 6.3 (!) — 6.35 is stored as 6.34999…
console.log(Math.round(6.35 * 10) / 10); // 6.4 — multiply-then-round is safer

// ── Parsing: Number/+ is strict, parseInt/parseFloat read what they can ──
console.log(+"100px"); // NaN
console.log(parseInt("100px")); // 100
console.log(parseFloat("12.5em")); // 12.5
console.log(parseInt("0xff", 16)); // 255 — always pass the radix
console.log(+""); // 0 (!) — empty string converts to 0, not NaN

// ── NaN: the only value not equal to itself ──
console.log(NaN === NaN); // false
console.log(Number.isNaN(NaN), Object.is(NaN, NaN)); // true true
console.log(isNaN("foo"), Number.isNaN("foo")); // true false — global isNaN coerces!
// Use Number.isNaN (no coercion) or Object.is.

// ── Two zeros exist ──
console.log(0 === -0, Object.is(0, -0)); // true false
console.log(1 / 0, 1 / -0); // Infinity -Infinity

// ── Numeric syntax goodies ──
console.log(1_000_000_000); // 1000000000 — separators
console.log(1e-6); // 0.000001
console.log(0b1111, 0o17, 0xff); // 15 15 255
console.log((255).toString(2)); // 11111111 — note the parens: 255.toString() is a SyntaxError
console.log((123456).toLocaleString("en-US")); // 123,456

// ── Rounding family ──
console.log(Math.floor(-1.1), Math.ceil(-1.1), Math.round(-1.5), Math.trunc(-1.9));
// -2 -1 -1 -1  — round(-1.5) goes UP to -1 (rounds half toward +∞), trunc just chops
