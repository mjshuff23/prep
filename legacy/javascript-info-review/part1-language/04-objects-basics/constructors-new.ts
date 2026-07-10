// Constructors — the TypeScript lens
// Run: npx tsx constructors-new.ts

// TS pushes you toward `class` — constructor FUNCTIONS don't type well because
// TS can't infer what `this` becomes. But you can type the pattern explicitly:

interface User {
  name: string;
  isAdmin: boolean;
}
// A "construct signature" describes something callable with `new`:
interface UserConstructor {
  new (name: string): User;
}

const UserFn = function (this: User, name: string) {
  this.name = name;
  this.isAdmin = false;
} as unknown as UserConstructor; // the cast is why classes are preferred

const u = new UserFn("Jack");
console.log(u.name, u.isAdmin); // Jack false

// ── The class version: zero casts, same runtime shape ──
class UserClass {
  isAdmin = false;
  constructor(public name: string) {} // parameter property: declares + assigns
}
console.log(new UserClass("Ann")); // UserClass { isAdmin: false, name: 'Ann' }

// ── Typing "any constructor of T": useful for factories/DI ──
type Ctor<T, A extends unknown[] = any[]> = new (...args: A) => T;

function build<T>(Ctor: Ctor<T, [string]>, arg: string): T {
  return new Ctor(arg);
}
console.log(build(UserClass, "Kim").name); // Kim

// ── InstanceType / ConstructorParameters: derive types from the class ──
type U = InstanceType<typeof UserClass>; // UserClass
type Args = ConstructorParameters<typeof UserClass>; // [name: string]
const args: Args = ["Lee"];
const fromArgs: U = new UserClass(...args);
console.log(fromArgs.name); // Lee

// ── new.target is typed too (used for no-new guards / abstract-at-runtime) ──
class OnlySubclassed {
  constructor() {
    if (new.target === OnlySubclassed) {
      throw new Error("abstract"); // TS `abstract class` enforces this at compile time
    }
  }
}
class Ok extends OnlySubclassed {}
new Ok(); // fine
try {
  new OnlySubclassed();
} catch (e) {
  console.log((e as Error).message); // abstract
}
