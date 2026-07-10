// Object to primitive — the TypeScript lens
// Run: npx tsx object-to-primitive.ts

// TS's biggest gift here: implicit coercion mostly WON'T TYPE-CHECK,
// so the whole class of [] + {} bugs disappears at compile time.

const user = { name: "John", money: 1000 };

// const x = user + 1;   // TS error: Operator '+' cannot be applied to these types
// const y = user > 500; // TS error: Operator '>' cannot be applied
const s = `${user}`; // template literals DO compile (everything is stringable)
console.log(s); // [object Object] — TS allows it, runtime is still ugly

// ── Typing Symbol.toPrimitive properly ──
class Money {
  constructor(public amount: number) {}
  [Symbol.toPrimitive](hint: "string" | "number" | "default"): string | number {
    if (hint === "string") return `$${this.amount}`;
    return this.amount; // number & default
  }
}
const m = new Money(42);
console.log(`${m}`); // $42
console.log(+m); // 42
console.log(Number(m) * 2); // 84 — explicit conversion keeps TS happy

// ── Explicit conversions are the TS-idiomatic road ──
console.log(Number([])); // 0    — still legal: you ASKED for it
console.log(String([1, 2])); // "1,2"
// TS's stance: coercion you can see (Number(), String()) is fine;
// coercion hidden inside an operator is a compile error.

// ── == is allowed only between overlapping types ──
// if ([] == 0) {}        // TS error: no overlap between never[] and number
const n: number | null = Math.random() > 2 ? 1 : null;
if (n == null) {
  // the ONE blessed == : catches null AND undefined together
  console.log("n is nullish"); // n is nullish
}

// ── toString():string is enforced when you implement it ──
class Tag {
  constructor(public name: string) {}
  toString(): string {
    return `#${this.name}`;
  }
}
console.log(`tag: ${new Tag("js")}`); // tag: #js
