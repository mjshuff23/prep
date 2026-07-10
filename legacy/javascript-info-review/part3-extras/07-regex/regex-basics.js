// Regex: patterns, flags, classes, anchors, boundaries, sets — javascript.info 7.1–7.8
// Run: node regex-basics.js

// ── Flags you actually use ──
// i case-insensitive · g all matches · m multiline anchors · s dot-matches-newline
// u unicode mode · y sticky (match at exact position)
console.log("We WILL rock".match(/will/i)?.[0]); // WILL
console.log("a1 b2 c3".match(/\d/g)); // [ '1', '2', '3' ] — g returns ALL, strings only
console.log("a1".match(/\d/)); // without g: one rich result [index, groups...]

// ── Character classes ──
// \d digit  \w word char [a-zA-Z0-9_]  \s whitespace — capitals negate: \D \W \S
console.log("+7(903)-123".replace(/\D/g, "")); // 7903123
// . = any char EXCEPT newline; /s makes it truly any:
console.log(/A.B/.test("A\nB"), /A.B/s.test("A\nB")); // false true

// ── Unicode: \p{...} classes need the u flag ──
console.log("Hello Привет 你好".match(/\p{Script=Han}/gu)); // [ '你', '好' ]
console.log("total: 3.14€".match(/\p{Sc}/u)?.[0]); // € — Sc = currency symbol class
console.log(/^.$/u.test("𝒳")); // true — /u makes . see one CODE POINT, not 2 units

// ── Anchors ^ $ and multiline mode ──
console.log(/^\d+$/.test("12345"), /^\d+$/.test("12a")); // true false — full-string test
const verses = "1st line\n2nd line\n3rd line";
console.log(verses.match(/^\d/g)); // [ '1' ] — ^ is string-start by default
console.log(verses.match(/^\d/gm)); // [ '1', '2', '3' ] — /m: per-LINE anchors

// ── Word boundary \b: a position between \w and non-\w ──
console.log("Hello, Java!".match(/\bJava\b/)?.[0]); // Java
console.log("Hello, JavaScript!".match(/\bJava\b/)); // null — no boundary after "Java"
console.log("1 23 456".match(/\b\d\d\b/g)); // [ '23' ] — works for numbers too
// \b does NOT work as expected on non-latin scripts (it's \w-based, ASCII notion).

// ── Escaping: special chars \ . ? + * ( ) [ ] { } | ^ $ / ──
console.log("5.1".match(/\d\.\d/)?.[0]); // 5.1 — \. is a literal dot
console.log("f(x)".match(/\(x\)/)?.[0]); // (x)
// Building from a string: DOUBLE escaping (string eats one backslash):
const re = new RegExp("\\d\\.\\d");
console.log(re.test("5.1")); // true
// Escaping user input for literal search (the standard util everyone rewrites):
const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
console.log(new RegExp(escapeRe("c++")).test("I know c++")); // true

// ── Sets [...] and ranges ──
console.log("Mop top".match(/[tm]op/gi)); // [ 'Mop', 'top' ]
console.log("Exception 0xAF".match(/x[0-9A-F][0-9A-F]/g)); // [ 'xAF' ]
console.log("alice15@gmail.com".match(/[\w.-]+@[\w.-]+/)?.[0]); // alice15@gmail.com
// Inside [...] most specials are literal; ^ FIRST means negation:
console.log("alice.com".match(/[^\w\s]/)?.[0]); // "." — first non-word, non-space char
// Ranges + u flag handle astral chars safely; without u, [𝒳] is broken surrogates.

// ── Sticky /y: match at EXACTLY lastIndex — the lexer flag ──
const sticky = /\w+/y;
sticky.lastIndex = 4;
console.log(sticky.exec("let varName = 1")?.[0]); // varName — parsed at position 4
sticky.lastIndex = 3;
console.log(sticky.exec("let varName = 1")); // null — position 3 is a space; /g would SEARCH onward
