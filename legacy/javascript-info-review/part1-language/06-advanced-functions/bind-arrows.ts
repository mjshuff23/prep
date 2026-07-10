// bind & arrows — the TypeScript lens
// Run: npx tsx bind-arrows.ts

// ── strictBindCallApply: bind is precisely typed, including partials ──
function mul(a: number, b: number): number {
  return a * b;
}
const double = mul.bind(null, 2); // (b: number) => number — one arg consumed
console.log(double(5)); // 10
// mul.bind(null, "2"); // TS error: string is not number

// ── Class fields + arrows: the this-safe handler pattern, typed ──
class Button {
  constructor(private label: string) {}
  // method: shared on prototype, loses this when detached
  clickMethod() {
    return `method: ${this.label}`;
  }
  // arrow field: per-instance closure, immune to detachment
  clickArrow = () => `arrow: ${this.label}`;
}
const b = new Button("OK");
const m = b.clickMethod;
const a = b.clickArrow;
try {
  m();
} catch (e) {
  console.log((e as Error).constructor.name); // TypeError — TS did NOT stop this
}
console.log(a()); // arrow: OK
// Trade-offs of arrow fields: one function object PER instance; invisible to
// subclass super.clickArrow(); harder to spy/mock on the prototype.

// ── Typed partial application without bind ──
function partial<P extends unknown[], A extends unknown[], R>(
  fn: (...args: [...P, ...A]) => R,
  ...preset: P
): (...args: A) => R {
  return (...args) => fn(...preset, ...args);
}
const greet = (greeting: string, name: string) => `${greeting}, ${name}!`;
const hi = partial(greet, "Hi"); // (name: string) => string
console.log(hi("Ann")); // Hi, Ann!
// Variadic tuple types [...P, ...A] split the parameter list — TS-only superpower.

// ── Arrows and generics: use the `const X = <T,>(...)` comma or a function ──
const identity = <T,>(x: T): T => x; // (the comma avoids JSX-parsing ambiguity in .tsx)
console.log(identity(42)); // 42

// ── `this` in arrows is checked against the ENCLOSING scope's this type ──
class Timer {
  seconds = 0;
  start() {
    setTimeout(() => {
      this.seconds++; // `this` typed as Timer — inherited from start()
      console.log("tick", this.seconds); // tick 1
    }, 10);
  }
}
new Timer().start();

// noImplicitThis (in strict) flags a lone `function () { this.x }` — the
// silent-undefined `this` of sloppy JS is a compile error in TS.
