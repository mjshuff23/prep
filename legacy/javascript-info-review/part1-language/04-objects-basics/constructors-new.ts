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

// ── Typing "any class that builds a value": useful for factories/DI ──
type ConstructorThatCreates<CreatedValue, ConstructorArguments extends unknown[] = any[]> =
  new (...args: ConstructorArguments) => CreatedValue;

function buildWithName<CreatedValue>(
  ClassToBuild: ConstructorThatCreates<CreatedValue, [string]>,
  name: string,
): CreatedValue {
  return new ClassToBuild(name);
}
console.log(buildWithName(UserClass, "Kim").name); // Kim

// ── Derive useful types from an existing class ──
type UserClassInstance = InstanceType<typeof UserClass>; // the object made by `new UserClass(...)`
type UserClassConstructorArguments = ConstructorParameters<typeof UserClass>; // [name: string]

const savedConstructorArguments: UserClassConstructorArguments = ["Lee"];
const userBuiltFromSavedArguments: UserClassInstance = new UserClass(...savedConstructorArguments);
console.log(userBuiltFromSavedArguments.name); // Lee

// ── new.target knows which class was actually called with `new` ──
class MustBeSubclassed {
  name = 'FakeName';
  isSubclassed = true;
  constructor() {
    if (new.target === MustBeSubclassed) {
      throw new Error("use a subclass"); // TS `abstract class` enforces this at compile time
    }
  }
}
class RealSubclass extends MustBeSubclassed {}
const exampleRealSubclass = new RealSubclass();
console.log(exampleRealSubclass.name, exampleRealSubclass.isSubclassed); // FakeName true
try {
  new MustBeSubclassed();
} catch (e) {
  console.log((e as Error).message); // use a subclass
}
