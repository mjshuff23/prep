# Part 3.7 — Regular expressions

Files: `regex-basics.js` · `quantifiers-groups.js` · `lookaround-methods.js` · `regex.ts`

## How the engine actually works (and why you care)

The JS regex engine is a **backtracking** matcher: it tries alternatives
left-to-right, and when a path dead-ends it *backs up* and tries the next option.
Every confusing regex behavior is this algorithm showing through:

- **Greedy quantifiers** (`.+`) eat as much as possible, then give back one char at a
  time until the rest of the pattern fits. Hence `".+"` matching from the *first*
  quote to the *last* quote of the whole string.
- **Lazy quantifiers** (`.+?`) do the reverse — match minimally, expand on demand.
- **The pro move is often neither**: a negated class (`"[^"]+"`) says exactly what you
  mean, can't backtrack pathologically, and is faster.
- **Catastrophic backtracking**: nested quantifiers that let the same text be split
  many ways (`(\w+\s?)*`) explode exponentially on *non-matching* input — that's the
  ReDoS vulnerability class. Fix by making pieces unambiguous (`(\w+\s)*\w*`), by the
  lookahead-capture trick `(?=(\w+))\1` (emulated atomic group), or by not running
  untrusted patterns at all.

## The vocabulary in one place

| Piece | Meaning |
|---|---|
| `\d \w \s` (`\D \W \S`) | digit / word char / whitespace (negations) |
| `[abc] [a-z] [^...]` | set, range, negated set |
| `^ $` (+ `m`) | string anchors (per-line with `m`) |
| `\b` | word boundary (ASCII `\w`-based — unreliable for non-Latin) |
| `{n,m} + * ?` | quantifiers; append `?` for lazy |
| `(x)` / `(?:x)` / `(?<n>x)` | capturing / non-capturing / named group |
| `\1 \k<n>` — `$1 $<n>` | backreference in pattern — in replacement |
| `x\|y` | alternation (group it! `gr(a\|e)y`) |
| `(?=x) (?!x) (?<=x) (?<!x)` | lookahead/behind, positive/negative — zero-width |
| `\p{...}` + `u` | Unicode property classes; `u` also fixes astral chars |

Flags: `i` case, `g` all matches, `m` multiline anchors, `s` dot-matches-newline,
`u` unicode, `y` sticky (match *exactly at* `lastIndex` — the lexer flag).

## Methods: which one when

- **Test?** `re.test(s)` — but beware: with `/g` it's *stateful* (`lastIndex`
  persists between calls), the classic once-true-then-false bug. Boolean checks
  shouldn't use `/g`.
- **First match + groups?** `s.match(re)` (no `g`) or `re.exec(s)`.
- **All matches + groups?** `s.matchAll(re)` (requires `g`) — `match` with `g`
  returns bare strings, dropping groups.
- **Replace?** `s.replace(re, replacement)` with `$&`, `$1`, `$<name>`, or a function
  replacer for logic. `replaceAll` only matters for *string* patterns (replaces all
  without a regex).
- **Split/search** accept regexes too.

Escaping: specials `. ? + * ( ) [ ] { } | ^ $ \` need `\`; in `new RegExp("...")`
strings they need `\\`. Escape user input with the standard
`replace(/[.*+?^${}()|[\]\\]/g, "\\$&")`.

TS lens: results are `| null` and groups `| undefined` — the compiler forces the
checks people skip in JS. Named groups type as `Record<string, string>` (typo-prone —
validate into a real interface at the boundary). Template literal types are
compile-time format checks for simple shapes.

## Predict the output

```js
// 1
console.log("aaa".match(/a+?/g));

// 2
console.log('"a" and "b"'.match(/".*"/)[0]);

// 3
const re = /\d+/g;
console.log(re.test("abc 123"), re.test("abc 123"));

// 4
console.log("2026-07-09".replace(/(\d+)-(\d+)/, "$2-$1"));

// 5
console.log("one two".match(/(?<=\s)\w+/)?.[0]);
```

<details>
<summary>Answers</summary>

1. `[ 'a', 'a', 'a' ]` — lazy `+?` matches the minimum (one char) each time; `g`
   restarts after each match.
2. `"a" and "b"` — greedy `.*` spans from first quote to last.
3. `true false` — `/g` statefulness: `lastIndex` is 7 after the first test, and the
   second search starts there, finding nothing.
4. `07-2026-09` — the regex matches `2026-07` only (first two number runs); they swap,
   `-09` is untouched.
5. `two` — lookbehind for a space; `one` has none before it.

</details>
