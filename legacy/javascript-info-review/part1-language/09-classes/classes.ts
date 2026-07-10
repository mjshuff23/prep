// Classes — the TypeScript lens (one file for the chapter)
// Run: npx tsx classes.ts

// ── Visibility: TS private/protected vs JS #private ──
class Account {
  private tsPrivate = 1; // compile-time only — erased! Runtime: plain property.
  #jsPrivate = 2; // real runtime privacy (and TS checks it too)
  protected forSubclasses = 3; // compile-time only
  readonly id: string; // write once (in ctor), compile-time only

  constructor(public owner: string) {
    // parameter property: declare + assign in one
    this.id = crypto.randomUUID().slice(0, 8);
  }
  reveal() {
    return [this.tsPrivate, this.#jsPrivate];
  }
}
const a = new Account("Ann");
console.log(a.reveal()); // [ 1, 2 ]
// a.tsPrivate;  // TS error — but present at runtime:
console.log(Object.keys(a)); // [ 'owner', 'tsPrivate', 'forSubclasses', 'id' ]
// — private/protected LEAKED into runtime keys; the #private didn't
console.log(JSON.stringify(a).includes("tsPrivate")); // true — the erasure gotcha
// Rule of thumb: `private` for design intent, `#` when privacy actually matters.

// ── abstract classes: compile-time contracts with shared implementation ──
abstract class Shape {
  abstract area(): number; // must be implemented
  describe() {
    return `area = ${this.area().toFixed(2)}`;
  }
}
class Circle2 extends Shape {
  constructor(private r: number) {
    super();
  }
  area() {
    return Math.PI * this.r ** 2;
  }
}
console.log(new Circle2(1).describe()); // area = 3.14
// new Shape(); // TS error: cannot instantiate abstract

// ── implements: structural check only — no runtime trace, no inherited impl ──
interface Serializable {
  serialize(): string;
}
class Point implements Serializable {
  constructor(
    public x: number,
    public y: number,
  ) {}
  serialize() {
    return `${this.x},${this.y}`;
  }
}
console.log(new Point(1, 2).serialize()); // 1,2

// ── instanceof narrows; #brand checks narrow better than tags ──
class Cat {
  #purr = true;
  static isCat(x: unknown): x is Cat {
    return typeof x === "object" && x !== null && #purr in x; // ES2022 brand check
  }
  meow() {
    return "meow";
  }
}
const maybe: unknown = new Cat();
if (Cat.isCat(maybe)) console.log(maybe.meow()); // meow — narrowed from unknown

function speak(pet: Cat | Point) {
  if (pet instanceof Cat) return pet.meow(); // narrowed to Cat
  return pet.serialize(); // narrowed to Point
}
console.log(speak(new Point(3, 4))); // 3,4

// ── Generic classes ──
class Stack<T> {
  private items: T[] = [];
  push(item: T): this {
    this.items.push(item);
    return this;
  }
  pop(): T | undefined {
    return this.items.pop();
  }
}
const s = new Stack<number>().push(1).push(2);
console.log(s.pop()); // 2
// s.push("x"); // TS error

// ── Typed mixins: the constructor-constraint pattern ──
type Ctor<T = object> = new (...args: any[]) => T;
function Timestamped<TBase extends Ctor>(Base: TBase) {
  return class extends Base {
    createdAt = "2026-07-09";
  };
}
function Serializable2<TBase extends Ctor>(Base: TBase) {
  return class extends Base {
    serialize() {
      return JSON.stringify(this);
    }
  };
}
class Model {}
class UserModel extends Serializable2(Timestamped(Model)) {
  name = "Kim";
}
const um = new UserModel(); // has createdAt AND serialize, fully typed
console.log(um.serialize()); // {"createdAt":"2026-07-09","name":"Kim"}
