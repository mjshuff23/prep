// Lookahead/lookbehind, catastrophic backtracking, methods — javascript.info 7.14–7.17
// Run: node lookaround-methods.js

// ── Lookahead (?=...) (?!...): assert what FOLLOWS without consuming it ──
const s = "1 turkey costs 30€, 2 cost 55$";
console.log(s.match(/\d+(?=€)/)?.[0]); // 30 — digits followed by €, € not in match
console.log(s.match(/\d+(?!€|\d)/g)); // digits NOT followed by € (or more digits)
console.log(s.match(/\d+(?=\s)(?=.*30)/)?.[0]); // 1 — lookaheads stack (AND semantics)

// ── Lookbehind (?<=...) (?<!...): assert what PRECEDES ──
console.log(s.match(/(?<=\$)\d+/)); // null — $ comes AFTER the price here; but:
console.log("price: $99".match(/(?<=\$)\d+/)?.[0]); // 99 — number preceded by $
console.log("10€ 20$".match(/(?<!\$)\b\d+/g)); // [ '10', '20' ]... careful: see README

// Capturing INSIDE lookaround works — assert context, capture a piece of it:
console.log('"quoted"'.match(/(?<=(["']))\w+(?=\1)/)?.[0]); // quoted

// ── Catastrophic backtracking: patterns that hang on NON-matching input ──
// /^(\d+)*$/ on "012345678901234567890123456789z" tries 2^n ways to split the
// digits between the inner + and outer * before concluding "no match".
// The smell: nested quantifiers where the same text can be divided multiple ways.
const evil = /^(\w+\s?)*$/; // classic vulnerable "words" pattern (ReDoS class)
console.log(evil.test("A correct string")); // true — fine on matches
// evil.test("An input that ends badly!!!".repeat(3)) — DON'T: exponential time.
// Fixes: 1) forbid ambiguity — make pieces non-overlapping:
const safe = /^(\w+\s)*\w*$/;
console.log(safe.test("A correct string"), safe.test("bad input!!".repeat(5))); // true false — instantly
// 2) atomic-style emulation via lookahead capture: (?=(\w+))\1 — match without backtracking.
// 3) In Node 24+/V8: the /v flag or RE2-style libs for untrusted patterns.

// ── The method matrix (string methods take regex; regex methods take strings) ──
const text = "JavaScript is fun, javascript is powerful";

// str.match / matchAll — find (see previous files)
// str.split — with regex separator + limit:
console.log("12, 34, 56".split(/,\s*/, 2)); // [ '12', '34' ]
// str.search — index of first match (no g support):
console.log(text.search(/fun/)); // 14
// str.replace / replaceAll — with $& $` $' $n $<name> and function replacers:
console.log("2026-07-09".replace(/-/g, ".")); // 2026.07.09
console.log("John Smith".replace(/(\w+) (\w+)/, "$2, $1")); // Smith, John
console.log("5 apples".replace(/\d+/, (m) => Number(m) * 2)); // 10 apples
// replaceAll with a STRING pattern replaces every occurrence (replace: only first):
console.log("a-b-c".replace("-", "+"), "a-b-c".replaceAll("-", "+")); // a+b-c a+b+c

// regexp.test — boolean:
console.log(/fun/.test(text)); // true

// regexp.exec — the stateful iterator (with /g): lastIndex advances:
const re = /is/g;
let match;
const positions = [];
while ((match = re.exec(text)) !== null) positions.push(match.index);
console.log(positions); // [ 11, 30 ] — matchAll is the modern, less error-prone form

// ── THE /g statefulness trap: test/exec share lastIndex across calls ──
const sticky = /java/gi;
console.log(sticky.test(text), sticky.lastIndex); // true 4 — state left behind!
console.log(sticky.test(text)); // true (found the 2nd), then...
console.log(sticky.test(text)); // false (!) — lastIndex ran off the end
// Never reuse a /g regex for boolean tests across strings; drop the flag or reset lastIndex.
