// Private/protected properties + Mixins — javascript.info 9.4, 9.7
// Run: node private-mixins.js

// ── Protected: a CONVENTION (_prefix), enforced by nothing ──
class CoffeeMachine {
  _waterAmount = 0; // "protected": internal + subclasses, please don't touch
  set waterAmount(value) {
    if (value < 0) throw new RangeError("negative water");
    this._waterAmount = value;
  }
  get waterAmount() {
    return this._waterAmount;
  }
}
const machine = new CoffeeMachine();
machine.waterAmount = 100;
console.log(machine.waterAmount); // 100
machine._waterAmount = -999; // nothing stops you — it's just a naming signal
console.log(machine._waterAmount); // -999

// ── Private: #fields — enforced by the LANGUAGE ──
class Account {
  #balance = 0; // real privacy: invisible outside the class body
  deposit(n) {
    this.#balance += n;
    return this;
  }
  get balance() {
    return this.#balance;
  }
  static sameBank(a, b) {
    return a.#balance === b.#balance; // class code can touch OTHER instances' #fields
  }
}
const acct = new Account().deposit(50);
console.log(acct.balance); // 50
console.log(Object.keys(acct), JSON.stringify(acct)); // [] {} — invisible everywhere
// acct.#balance          // SyntaxError — not even a runtime check, a parse error
console.log(acct["#balance"]); // undefined — not reachable via brackets either

// #privates are NOT inherited-accessible: subclasses can't read parent's #fields.
// And a #field access on the wrong object type throws:
try {
  Account.prototype.deposit.call({}, 5); // {} has no #balance slot
} catch (e) {
  console.log(e.constructor.name); // TypeError — "brand check" (used for instanceof-proof checks: #x in obj)
}

// ── Mixins: copying methods in, since JS has single inheritance ──
const sayHiMixin = {
  sayHi() {
    return `Hello ${this.name}`;
  },
  sayBye() {
    return `Bye ${this.name}`;
  },
};
const eventMixin = {
  on(event, handler) {
    (this._handlers ??= {})[event] ??= [];
    this._handlers[event].push(handler);
  },
  trigger(event, ...args) {
    (this._handlers?.[event] ?? []).forEach((h) => h.apply(this, args));
  },
};

class Person {
  constructor(name) {
    this.name = name;
  }
}
Object.assign(Person.prototype, sayHiMixin, eventMixin); // the whole trick

const p = new Person("Ann");
console.log(p.sayHi()); // Hello Ann
p.on("promoted", (title) => console.log(`Ann is now ${title}`));
p.trigger("promoted", "CTO"); // Ann is now CTO

// ── "Subclass factory" mixins: parameterized inheritance chains ──
const Serializable = (BaseCls) =>
  class extends BaseCls {
    serialize() {
      return JSON.stringify(this);
    }
  };
const Timestamped = (BaseCls) =>
  class extends BaseCls {
    constructor(...args) {
      super(...args);
      this.createdAt = "2026-07-09";
    }
  };
class Model {}
class UserModel extends Serializable(Timestamped(Model)) {
  constructor() {
    super();
    this.name = "Kim";
  }
}
const um = new UserModel();
console.log(um.serialize()); // {"createdAt":"2026-07-09","name":"Kim"}
console.log(um instanceof Model); // true — it's a real chain: UserModel → Serializable(...) → Timestamped(...) → Model
