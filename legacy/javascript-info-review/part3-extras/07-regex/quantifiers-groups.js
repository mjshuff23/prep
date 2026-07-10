// Quantifiers, greedy/lazy, groups, backreferences, alternation — javascript.info 7.9–7.13
// Run: node quantifiers-groups.js

// ── Quantifiers: {n} {n,} {n,m} + * ? ──
console.log("I'm 12345 years".match(/\d{5}/)?.[0]); // 12345
console.log("+7(903)-123-45-67".match(/\d{1,}/g)); // [ '7', '903', '123', '45', '67' ]
// + = {1,}   * = {0,}   ? = {0,1}
console.log("100 10 1".match(/\d0*/g)); // [ '100', '10', '1' ]
console.log("100 10 1".match(/\d0+/g)); // [ '100', '10' ] — + needs at least one 0

// ── Greedy vs lazy: THE regex interview question ──
const s = 'a "witch" and her "broom" is one';
console.log(s.match(/".+"/g)); // [ '"witch" and her "broom"' ] — greedy .+ ate everything,
// then backtracked just enough for the final quote. NOT per-quote-pair!
console.log(s.match(/".+?"/g)); // [ '"witch"', '"broom"' ] — lazy: expand only as needed
console.log(s.match(/"[^"]+"/g)); // [ '"witch"', '"broom"' ] — negated class: usually
// BETTER than lazy — clearer intent, no backtracking, and faster.

// ── Capturing groups: (...) — save the part, enable quantifying units ──
console.log("Gogogo now!".match(/(go)+/i)?.[0]); // Gogogo — quantifier on the GROUP
const dateMatch = "2026-07-09".match(/(\d{4})-(\d{2})-(\d{2})/);
console.log(dateMatch[1], dateMatch[2], dateMatch[3]); // 2026 07 09 — index by paren order
// Nested groups number by OPENING paren position:
const tag = "<span class='x'>".match(/<(([a-z]+)\s*([^>]*))>/);
console.log(tag[1], "|", tag[2], "|", tag[3]); // span class='x' | span | class='x'

// ── Named groups (?<name>...): stop counting parens ──
const groups = "2026-07-09".match(/(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/).groups;
console.log(groups.year, groups.month, groups.day); // 2026 07 09

// ── Non-capturing (?:...): group for quantifying WITHOUT saving ──
const m = "Gogogo John!".match(/(?:go)+ (\w+)/i);
console.log(m[1], m.length); // John 2 — no junk "go" capture

// ── Optional groups match as undefined; g-flag drops groups (use matchAll) ──
console.log("a".match(/a(z)?/)[1]); // undefined
console.log([..."2026-07-09, 2027-01-01".matchAll(/(?<y>\d{4})-\d{2}-\d{2}/g)].map(
  (mm) => mm.groups.y,
)); // [ '2026', '2027' ] — matchAll = all matches WITH groups (match+g gives strings only)

// ── Backreferences: \1 or \k<name> — "the same text again" ──
const quoted = `He said: "She's the one!".`;
console.log(quoted.match(/(['"])(.*?)\1/)?.[2]); // She's the one! — closes with the SAME quote
console.log(`"a" 'b'`.match(/(?<q>['"]).*?\k<q>/g)); // [ '"a"', "'b'" ]
// In the REPLACEMENT string it's $1/$<name>, not \1:
console.log("John Smith".replace(/(?<first>\w+) (?<last>\w+)/, "$<last>, $<first>")); // Smith, John

// ── Alternation | : OR at the pattern level — watch the grouping! ──
console.log("Java JavaScript PHP".match(/Java(Script)?|PHP/g)); // [ 'Java', 'JavaScript', 'PHP' ]
const time = "00:00 10:10 23:59 25:99 02:69";
console.log(time.match(/\b([01]\d|2[0-3]):[0-5]\d\b/g)); // [ '00:00', '10:10', '23:59' ]
// Without the group: /[01]\d|2[0-3]:.../ parses as ([01]\d) OR (2[0-3]:...) — classic bug.
