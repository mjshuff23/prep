// Function objects — the TypeScript lens
// Run: npx tsx function-objects.ts

// ── Callable-with-properties: a hybrid type ──
interface CounterFn {
  (): void; // call signature
  counter: number; // property
  reset(): void;
}
function makeCounterFn(): CounterFn {
  const fn = (() => {
    fn.counter++;
  }) as CounterFn; // assemble, then assert — the standard idiom
  fn.counter = 0;
  fn.reset = () => {
    fn.counter = 0;
  };
  return fn;
}
const hit = makeCounterFn();
hit();
hit();
console.log(hit.counter); // 2
hit.reset();
console.log(hit.counter); // 0

// ── Function TYPES: four ways to write them ──
type F1 = (a: number, b: number) => number; // arrow syntax (preferred)
interface F2 {
  (a: number, b: number): number;
} // call-signature form
type F3 = { (a: number, b: number): number }; // same, inline
// Method vs property style matters for variance:
interface Api {
  methodStyle(x: number | string): void; // bivariant params (looser, historical)
  propStyle: (x: number | string) => void; // strictly checked (prefer this)
}
const add: F1 = (a, b) => a + b;
console.log(add(2, 3)); // 5

// ── Overloads: one implementation, several typed façades ──
function parse(x: string): number;
function parse(x: number): string;
function parse(x: string | number): number | string {
  return typeof x === "string" ? Number(x) : String(x);
}
const n = parse("42"); // number
const s = parse(42); // string
console.log(n, s); // 42 "42"
// Callers see precise pairings; without overloads both would be number|string.

// ── typeof f, Parameters, ReturnType: reflecting function types ──
type AddParams = Parameters<typeof add>; // [a: number, b: number]
type AddRet = ReturnType<typeof add>; // number
const args: AddParams = [1, 2];
const r: AddRet = add(...args);
console.log(r); // 3

// ── new Function returns Function — typed as the top type of callables ──
const sum = new Function("a", "b", "return a + b") as (a: number, b: number) => number;
console.log(sum(1, 2)); // 3 — the cast is a PROMISE, not a check. Runtime strings
// can't be type-checked; another reason new Function/eval don't belong in TS code.

// ── void return type: "I will ignore your return value" ──
type Callback = () => void;
const cb: Callback = () => 123; // legal! void-returning TYPES accept any return...
console.log(cb()); // 123 ...but you may not USE it as non-void. Enables push-style APIs:
[1, 2].forEach((x) => x * 2); // callbacks that return values still fit () => void
