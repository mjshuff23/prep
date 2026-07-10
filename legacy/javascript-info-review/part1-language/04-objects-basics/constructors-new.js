// Constructor functions and operator "new" — javascript.info 4.5
// Run: node constructors-new.js

// ── What `new F()` actually does ──
// 1. Creates a fresh object with its [[Prototype]] set to F.prototype
// 2. Calls F with this = that object
// 3. Returns this — UNLESS F explicitly returns an object (then that wins)
function User(name) {
  // this = {} (implicitly, prototype-linked to User.prototype)
  this.name = name;
  this.isAdmin = false;
  // return this (implicitly)
}
const u = new User("Jack");
console.log(u.name, u.isAdmin); // Jack false

// ── Gotcha: forgetting `new` ──
// In strict mode (modules), this === undefined → TypeError. In sloppy mode it
// would silently pollute globalThis. new.target lets a function detect the mode:
function Guarded(name) {
  if (!new.target) return new Guarded(name); // called without new? fix it up
  this.name = name;
}
console.log(Guarded("no-new").name); // "no-new" — still worked

// ── Return-value rule: returned OBJECTS replace this, primitives are ignored ──
function BigUser() {
  this.name = "John";
  return { name: "Godzilla" }; // object → returned instead of this
}
function SmallUser() {
  this.name = "John";
  return "ignored"; // primitive → ignored, this is returned
}
console.log(new BigUser().name); // Godzilla
console.log(new SmallUser().name); // John

// ── Methods created per-instance vs shared (preview of prototypes) ──
function Rabbit(name) {
  this.name = name;
  this.hop = function () {}; // NEW function object per instance — wasteful
}
const r1 = new Rabbit("a");
const r2 = new Rabbit("b");
console.log(r1.hop === r2.hop); // false — 1000 rabbits = 1000 hop functions
// Chapter 08 fixes this with Rabbit.prototype.hop (one shared function).

// ── new with an anonymous IIFE-style constructor (one-off complex object) ──
const config = new (function () {
  this.host = "localhost";
  this.port = 5432;
  this.url = `postgres://${this.host}:${this.port}`; // can compute during construction
})();
console.log(config.url); // postgres://localhost:5432
