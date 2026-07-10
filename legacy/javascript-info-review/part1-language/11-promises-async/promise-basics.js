// Callbacks → Promises → Chaining — javascript.info 11.1–11.3
// Run: node promise-basics.js

// ── The problem: callback hell / pyramid of doom ──
function loadStep(name, cb) {
  setTimeout(() => cb(null, `${name} loaded`), 5);
}
loadStep("one", (err, r1) => {
  loadStep("two", (err, r2) => {
    loadStep("three", (err, r3) => {
      console.log("1:", r3); // 1: three loaded — three levels deep and growing
    });
  });
});

// ── A promise: an object linking "producing code" to "consuming code" ──
const promise = new Promise((resolve, reject) => {
  // executor runs IMMEDIATELY and synchronously
  setTimeout(() => resolve("done"), 10);
});
promise.then((v) => console.log("2:", v)); // 2: done

// State machine: pending → fulfilled(value) | rejected(error). ONE WAY, ONCE:
const once = new Promise((resolve) => {
  resolve(1);
  resolve(2); // ignored
  throw new Error("also ignored — already settled");
});
once.then((v) => console.log("3:", v)); // 3: 1

// Subscribers attached AFTER settlement still fire (unlike events!):
setTimeout(() => once.then((v) => console.log("4: late subscriber sees", v)), 30); // 4: ... 1

// ── Chaining: each .then returns a NEW promise resolving to its return value ──
new Promise((res) => res(1))
  .then((v) => v * 2)
  .then((v) => v * 2)
  .then((v) => console.log("5:", v)); // 5: 4

// THE chaining rule: return a PROMISE and the chain waits for it:
const delay = (ms, v) => new Promise((res) => setTimeout(() => res(v), ms));
delay(5, 10)
  .then((v) => delay(5, v * 2)) // returning a promise → next then gets its VALUE
  .then((v) => console.log("6:", v)); // 6: 20

// Classic mistake: adding several .then to ONE promise is NOT chaining:
const p = delay(5, 1);
p.then((v) => v + 1);
p.then((v) => v + 1);
p.then((v) => console.log("7:", v)); // 7: 1 — independent subscribers, no accumulation

// Another classic: forgetting to RETURN inside then:
delay(5, "x")
  .then((v) => {
    delay(5, "inner ignored"); // no return → chain does NOT wait, next gets undefined
  })
  .then((v) => console.log("8:", v)); // 8: undefined

// ── Thenables: the chain accepts anything with a .then method (duck typing) ──
const thenable = {
  then(resolve) {
    resolve("from thenable");
  },
};
Promise.resolve()
  .then(() => thenable)
  .then((v) => console.log("9:", v)); // 9: from thenable — how libraries interop

// ── Promisification: callback API → promise API (Node has util.promisify) ──
function promisify(fn) {
  return (...args) =>
    new Promise((resolve, reject) => {
      fn(...args, (err, result) => (err ? reject(err) : resolve(result)));
    });
}
const loadStepP = promisify(loadStep);
loadStepP("four").then((r) => console.log("10:", r)); // 10: four loaded
