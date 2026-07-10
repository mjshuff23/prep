// Object.keys/entries + Destructuring — the TypeScript lens
// Run: npx tsx object-keys-destructuring.ts

// ── THE Object.keys pain: it returns string[], not (keyof T)[] ──
const prices = { banana: 1, orange: 2 };
for (const k of Object.keys(prices)) {
  // console.log(prices[k]); // TS error: string can't index { banana; orange }
  // WHY: structural typing — at runtime the object may have EXTRA keys TS doesn't
  // know about, so keyof T would be unsound. The pragmatic escape:
  console.log(prices[k as keyof typeof prices]); // 1 / 2
}
// Object.entries values are properly typed; keys are still string:
for (const [k, v] of Object.entries(prices)) {
  console.log(k, v * 2); // banana 2 / orange 4  (v: number — inferred!)
}

// Typed helper when you KNOW the object is closed:
const typedKeys = <T extends object>(o: T) => Object.keys(o) as (keyof T)[];
console.log(typedKeys(prices)); // [ 'banana', 'orange' ]

// ── Destructuring: inference flows through, rename ≠ type annotation ──
const options = { title: "Menu", height: 200 };
const { title, height: h } = options; // title: string, h: number
console.log(title, h); // Menu 200
// Annotating a destructured binding uses the FULL pattern (a common confusion):
const { title: t2 }: { title: string } = options; // `: string` after t2 would be a RENAME
console.log(t2); // Menu

// ── Named params: the destructured-parameter idiom, fully typed ──
interface MenuOpts {
  title?: string;
  width?: number;
  items?: string[];
}
function showMenu({ title = "Untitled", width = 200, items = [] }: MenuOpts = {}) {
  // defaults REMOVE undefined from the types: title is string here, not string|undefined
  console.log(`${title} ${width} [${items}]`);
}
showMenu({ items: ["a"] }); // Untitled 200 [a]
// showMenu({ titel: "typo" }); // TS error: excess property check catches the typo

// ── Tuple returns + destructuring: the React-hook shape ──
function useCounter(): [number, (n: number) => void] {
  let n = 0;
  return [n, (v) => void (n = v)];
}
const [count, setCount] = useCounter(); // both precisely typed by position
console.log(count, typeof setCount); // 0 function

// ── Rest in destructuring builds the Omit for you ──
const user = { id: 1, name: "Ann", password: "secret" };
const { password, ...publicUser } = user; // publicUser: { id: number; name: string }
console.log(publicUser); // { id: 1, name: 'Ann' }
void password; // (noUnusedLocals would flag it otherwise)
