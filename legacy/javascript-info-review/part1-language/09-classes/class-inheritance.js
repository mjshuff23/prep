// Class inheritance + extending built-ins + instanceof — javascript.info 9.2, 9.5, 9.6
// Run: node class-inheritance.js

// ── extends wires two prototype chains ──
class Animal {
  constructor(name) {
    this.name = name;
    this.speed = 0;
  }
  run(speed) {
    this.speed = speed;
    return `${this.name} runs at ${speed}`;
  }
  stop() {
    this.speed = 0;
    return `${this.name} stands still`;
  }
}
class Rabbit extends Animal {
  hide() {
    return `${this.name} hides!`;
  }
  stop() {
    return `${super.stop()} and ${this.hide()}`; // super.method(): parent's version
  }
}
const rabbit = new Rabbit("White Rabbit");
console.log(rabbit.run(5)); // White Rabbit runs at 5
console.log(rabbit.stop()); // White Rabbit stands still and White Rabbit hides!

// ── Derived constructors MUST call super() before using this ──
class Loud extends Animal {
  constructor(name, volume) {
    // console.log(this); // ReferenceError here — this doesn't exist yet!
    super(name); // parent creates this; only THEN may we touch it
    this.volume = volume;
  }
}
console.log(new Loud("Dog", 11).volume); // 11
// WHY: in a derived class, the PARENT constructor allocates the object
// (important for extending Array/Error, which allocate exotic objects).

// ── super is resolved via [[HomeObject]] — lexically, at definition site ──
// That's why super only works in METHODS (shorthand syntax), not function props,
// and why arrow functions inside methods can use the outer super:
const parentObj = {
  greet() {
    return "parent greet";
  },
};
const childObj = {
  __proto__: parentObj,
  greet() {
    return `child + ${super.greet()}`; // works: method shorthand has [[HomeObject]]
  },
  // broken: function () { return super.greet(); } — SyntaxError: 'super' outside method
};
console.log(childObj.greet()); // child + parent greet

// ── Static inheritance: the second chain between the classes themselves ──
class Base {
  static kind() {
    return "base";
  }
}
class Derived extends Base {}
console.log(Derived.kind()); // base — statics inherit
console.log(Object.getPrototypeOf(Derived) === Base); // true

// ── Extending built-ins: Array subclass methods return the SUBCLASS ──
class PowerArray extends Array {
  isEmpty() {
    return this.length === 0;
  }
}
const pa = PowerArray.from([1, 20, 3]);
const filtered = pa.filter((x) => x >= 10); // filter builds a PowerArray!
console.log(filtered.isEmpty(), filtered instanceof PowerArray); // false true
// Symbol.species can opt out (make filter/map return plain Array):
class PlainResults extends Array {
  static get [Symbol.species]() {
    return Array;
  }
  isEmpty() {
    return this.length === 0;
  }
}
const pr = PlainResults.from([1, 2]);
console.log(pr.filter(Boolean) instanceof PlainResults); // false — plain Array now

// ── instanceof: walks the prototype chain (customizable) ──
console.log(rabbit instanceof Animal); // true — Animal.prototype is in the chain
console.log([] instanceof Object); // true — chains end at Object.prototype
class Even {
  static [Symbol.hasInstance](obj) {
    return typeof obj === "number" && obj % 2 === 0; // instanceof is a HOOK
  }
}
console.log(4 instanceof Even, 3 instanceof Even); // true false

// Object.prototype.toString: the classic precise type probe
const tag = (x) => Object.prototype.toString.call(x).slice(8, -1);
console.log(tag([]), tag(null), tag(/x/), tag(Promise.resolve())); // Array Null RegExp Promise
