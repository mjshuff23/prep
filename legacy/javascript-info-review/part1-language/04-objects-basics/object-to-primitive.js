// Object to primitive conversion — javascript.info 4.8
// Run: node object-to-primitive.js

// ── The algorithm: three "hints" — "string", "number", "default" ──
// 1. Call obj[Symbol.toPrimitive](hint) if it exists
// 2. Else, hint "string": try toString() then valueOf()
//    hints "number"/"default": try valueOf() then toString()
// Result MUST be a primitive, or TypeError.

const user = {
  name: "John",
  money: 1000,
  [Symbol.toPrimitive](hint) {
    console.log(`  hint: ${hint}`);
    return hint === "string" ? `{name: "${this.name}"}` : this.money;
  },
};
console.log(String(user)); // hint: string  → {name: "John"}
console.log(+user); // hint: number  → 1000
console.log(user + 1); // hint: default → 1001 (binary + doesn't know if it's math or concat)
console.log(user > 500); // hint: number  → true

// ── Default behavior (no custom hooks): plain objects stringify to the classic ──
console.log(String({})); // [object Object]  (Object.prototype.toString)
console.log(+{}); // NaN              ("[object Object]" → number fails)

// ── The famous interview coercions, explained ──
console.log([] + []); // ""      — arrays toString() to joined contents; "" + "" = ""
console.log([] + {}); // "[object Object]"
console.log([1, 2] + [3]); // "1,23"  — "1,2" + "3"
console.log(+[]); // 0       — [] → "" → 0
console.log(+[5]); // 5       — [5] → "5" → 5
console.log(+[1, 2]); // NaN     — "1,2" isn't a number
console.log({} + []); // "[object Object]" here (as an EXPRESSION);
// at a REPL start-of-line, {} parses as an empty block and you'd see 0. Classic trap.

// ── == uses hint "default"; that's why these hold ──
console.log([0] == false); // true  — [0] → "0" → 0, false → 0
console.log([] == 0); // true  — [] → "" → 0
console.log([] == ![]); // true! — ![] is false → 0; [] → 0. Use === and none of this exists.

// ── valueOf/toString pair (legacy but common in the wild) ──
const money = {
  amount: 42,
  valueOf() {
    return this.amount;
  },
  toString() {
    return `$${this.amount}`;
  },
};
console.log(money * 2); // 84   (number hint → valueOf)
console.log(`${money}`); // $42  (string hint → toString)
console.log(money + ""); // "42" — GOTCHA: default hint prefers valueOf, not toString!
