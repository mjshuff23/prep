// Decorators & call/apply — the TypeScript lens
// Run: npx tsx decorators-call-apply.ts

// ── A fully-typed wrapping decorator: generics preserve the signature ──
function logged<This, A extends unknown[], R>(
  fn: (this: This, ...args: A) => R,
): (this: This, ...args: A) => R {
  return function (this: This, ...args: A): R {
    console.log(`  calling with ${JSON.stringify(args)}`);
    return fn.apply(this, args); // apply is typed: args must match A, this must match This
  };
}
const double = logged((x: number) => x * 2);
console.log(double(21)); // calling with [21] / 42
// double("x"); // TS error — signature survived the wrap

// ── Typed memoize with cache-key control ──
function memoize<A extends unknown[], R>(
  fn: (...args: A) => R,
  keyFn: (...args: A) => string = (...a) => JSON.stringify(a),
): (...args: A) => R {
  const cache = new Map<string, R>();
  return (...args) => {
    const key = keyFn(...args);
    if (!cache.has(key)) cache.set(key, fn(...args));
    return cache.get(key)!; // `!`: has() just proved it — TS can't connect has/get
  };
}
let calls = 0;
const square = memoize((x: number) => (calls++, x * x));
console.log(square(4), square(4), calls); // 16 16 1

// ── ES/TS class method decorators (TS 5.0 standard decorators) ──
function measured<This, A extends unknown[], R>(
  method: (this: This, ...args: A) => R,
  ctx: ClassMethodDecoratorContext<This, (this: This, ...args: A) => R>,
) {
  return function (this: This, ...args: A): R {
    const t = performance.now();
    const result = method.apply(this, args);
    console.log(`${String(ctx.name)} took ${(performance.now() - t).toFixed(1)}ms`);
    return result;
  };
}
class MathService {
  @measured
  fib(n: number): number {
    return this.fibRec(n); // decorate the entry point, not the recursive helper —
  } //                        otherwise every recursive call logs too
  private fibRec(n: number): number {
    return n < 2 ? n : this.fibRec(n - 1) + this.fibRec(n - 2);
  }
}
console.log(new MathService().fib(20)); // fib took X.Xms / 6765

// ── call/apply/bind are typed via CallableFunction in lib.d.ts ──
function greet(this: { name: string }, punct: string) {
  return `Hi, ${this.name}${punct}`;
}
console.log(greet.call({ name: "Ann" }, "!")); // Hi, Ann!
// greet.call({ nick: "x" }, "!"); // TS error: wrong this shape
// greet.apply({ name: "A" }, [1]); // TS error: args tuple mismatch
// (this checking requires strictBindCallApply — part of `strict`.)
