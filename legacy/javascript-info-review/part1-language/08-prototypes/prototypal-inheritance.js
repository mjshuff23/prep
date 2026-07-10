// Prototypal inheritance + F.prototype — javascript.info 8.1, 8.2
// Run: node prototypal-inheritance.js

// ── [[Prototype]]: the hidden link; reads walk UP, writes stay LOCAL ──
const animal = {
  eats: true,
  walk() {
    return `${this.name ?? "animal"} walks`;
  },
};
const rabbit = Object.create(animal, { name: { value: "Rabbit", enumerable: true } });
console.log(rabbit.eats); // true — found on the prototype
console.log(rabbit.walk()); // Rabbit walks — `this` is ALWAYS the object before the dot,
//                             no matter where the method was found. Prototypes share
//                             METHODS, never state.

rabbit.eats = false; // write creates an OWN property; animal untouched
console.log(rabbit.eats, animal.eats); // false true
delete rabbit.eats;
console.log(rabbit.eats); // true — the prototype's value shows through again

// ── Accessors are the exception: a SETTER on the prototype runs instead ──
const userProto = {
  set fullName(v) {
    [this.name, this.surname] = v.split(" ");
  },
  get fullName() {
    return `${this.name} ${this.surname}`;
  },
};
const admin = Object.create(userProto);
admin.fullName = "Alice Cooper"; // setter runs with this=admin → own name/surname
console.log(admin.fullName, Object.keys(admin)); // Alice Cooper [ 'name', 'surname' ]

// ── for..in includes inherited enumerables; hasOwnProperty filters ──
const all = [];
for (const key in rabbit) all.push(key);
console.log(all); // [ 'name', 'eats', 'walk' ] — own first, then inherited enumerables
console.log(Object.keys(rabbit)); // [ 'name' ] — own only
console.log(Object.hasOwn(rabbit, "walk"), "walk" in rabbit); // false true

// ── F.prototype: just a regular property, used ONCE at `new` time ──
function Rabbit(name) {
  this.name = name;
}
Rabbit.prototype.jumps = true; // augment, don't replace (see below)
const r = new Rabbit("R1");
console.log(Object.getPrototypeOf(r) === Rabbit.prototype); // true
console.log(r.jumps); // true

// Replacing F.prototype later does NOT affect existing objects:
Rabbit.prototype = { swims: true };
const r2 = new Rabbit("R2");
console.log(r.jumps, r.swims); // true undefined — r still links to the OLD object
console.log(r2.swims, r2.jumps); // true undefined

// ── The default prototype has `constructor` — replacing loses it ──
function Dog() {}
console.log(Dog.prototype.constructor === Dog); // true — comes for free
Dog.prototype = { bark: true }; // whoops: constructor now Object
console.log(new Dog().constructor === Dog); // false — inherited from Object.prototype
Dog.prototype.constructor = Dog; // manual repair (non-enumerable in real code)
console.log(new Dog().constructor === Dog); // true
// Why care: `new obj.constructor()` is how generic code clones "same kind of" objects.

// ── The chain terminates at null ──
console.log(Object.getPrototypeOf(Object.prototype)); // null
// rabbit → animal → Object.prototype → null
