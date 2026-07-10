// Prototypes — the TypeScript lens (one file for the chapter)
// Run: npx tsx prototypes.ts

// TS models the RESULT of prototypal inheritance (member sets), not the chain
// itself — there's no type-level distinction between own and inherited.

// ── Object.create is typed loosely: prefer typing the result yourself ──
interface Animal {
  eats: boolean;
  walk(): string;
}
const animalProto = {
  eats: true,
  walk(this: { name?: string }) {
    return `${this.name ?? "animal"} walks`;
  },
};
interface Rabbit extends Animal {
  name: string;
}
const rabbit: Rabbit = Object.assign(Object.create(animalProto), { name: "R" });
console.log(rabbit.walk()); // R walks
// Object.create returns `any` in lib.d.ts (!) — annotate or you lose all checking.

// ── Own vs inherited: invisible to types, so hasOwn checks stay runtime-only ──
console.log(Object.hasOwn(rabbit, "name"), Object.hasOwn(rabbit, "eats")); // true false
// `in` narrows TYPES, but by declared members: no own/inherited distinction.

// ── Record<string, T> objects can still be __proto__-poisoned — TS won't warn ──
const dict: Record<string, string> = {};
const key = "__proto__" as string;
dict[key] = "value"; // compiles cleanly; at runtime this write is swallowed
console.log(Object.keys(dict).length); // 0 (!) — TS believed the write succeeded
const safe = new Map<string, string>(); // the typed fix is also the runtime fix
safe.set(key, "value");
console.log(safe.get(key)); // value

// ── Object.create(null) dictionaries: type as Record + null-proto at runtime ──
const bare: Record<string, number> = Object.create(null);
bare["__proto__"] = 1; // genuinely stored now
console.log(bare["__proto__"]); // 1
// console.log(bare.toString); // typed as... error only if noImplicitAny on index misuse;
// runtime: undefined — TS assumes Object.prototype members exist. Slight model mismatch.

// ── getPrototypeOf returns `any`-ish (object | null) — chains are untyped ──
const proto = Object.getPrototypeOf(rabbit); // any — walk chains with runtime care
console.log(proto === animalProto); // true

// ── The TS way to share behavior is still classes/mixins — typed chain included ──
class Base {
  greet() {
    return "hi";
  }
}
class Derived extends Base {
  shout() {
    return this.greet().toUpperCase();
  }
}
console.log(new Derived().shout()); // HI
// `extends` IS prototypal inheritance underneath: Derived.prototype → Base.prototype.
console.log(Object.getPrototypeOf(Derived.prototype) === Base.prototype); // true
