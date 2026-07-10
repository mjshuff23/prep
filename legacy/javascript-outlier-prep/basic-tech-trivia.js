/*
  Basic Tech Trivia Exercises

  Run with:
    node javascript-outlier-prep/basic-tech-trivia.js

  Goal:
  Predict each answer before uncommenting or filling in the code.
*/

console.log("=== typeof drills ===");

// TODO: Before running, write your predicted output beside each line.
console.log(typeof NaN); // prediction:
console.log(typeof null); // prediction:
console.log(typeof []); // prediction:
console.log(typeof {}); // prediction:
console.log(typeof (() => {})); // prediction:
console.log(typeof undefined); // prediction:
console.log(typeof Symbol("id")); // prediction:
console.log(typeof 10n); // prediction:

console.log("\n=== array detection ===");

// TODO: Fill in the expression that correctly checks whether value is an array.
const possibleArray = [];
const isArray = undefined; // TODO
console.log(isArray);

console.log("\n=== NaN drills ===");

// TODO: Predict these before running.
console.log(NaN === NaN); // prediction:
console.log(Number.isNaN(NaN)); // prediction:
console.log(Number.isNaN("hello")); // prediction:
console.log(isNaN("hello")); // prediction:
console.log(Object.is(NaN, NaN)); // prediction:

console.log("\n=== null and undefined ===");

// TODO: Predict these before running.
console.log(null == undefined); // prediction:
console.log(null === undefined); // prediction:
console.log(typeof undefined); // prediction:
console.log(typeof null); // prediction:

console.log("\n=== truthy and falsy ===");

// TODO: Fill this array with every falsy value you can remember.
const falsyValues = [];
console.log(falsyValues.map(Boolean));

// TODO: Predict these before running.
console.log(Boolean([])); // prediction:
console.log(Boolean({})); // prediction:
console.log(Boolean("false")); // prediction:
console.log(Boolean("0")); // prediction:

console.log("\n=== equality traps ===");

// TODO: Predict these before running.
console.log([] == false); // prediction:
console.log([] === false); // prediction:
console.log([] == true); // prediction:
console.log(![]); // prediction:
console.log(!![]); // prediction:
console.log([1] == 1); // prediction:
console.log([1, 2] == "1,2"); // prediction:
console.log([] == ""); // prediction:
console.log([] == 0); // prediction:
console.log("" == 0); // prediction:
console.log("0" == false); // prediction:
console.log(null == 0); // prediction:
console.log(undefined == 0); // prediction:

console.log("\n=== Object.is ===");

// TODO: Predict these before running.
console.log(Object.is(NaN, NaN)); // prediction:
console.log(Object.is(0, -0)); // prediction:
console.log(0 === -0); // prediction:

console.log("\n=== hoisting ===");

function varHoistingDrill() {
  // TODO: Predict what logs.
  console.log(a);
  var a = 1;
}

varHoistingDrill();

function functionDeclarationHoistingDrill() {
  // TODO: Predict whether this works.
  console.log(sayHi());

  function sayHi() {
    return "hi";
  }
}

functionDeclarationHoistingDrill();

function functionExpressionHoistingDrill() {
  // TODO: Uncomment after predicting whether it logs or throws.
  // console.log(sayBye());

  var sayBye = function () {
    return "bye";
  };

  console.log(sayBye());
}

functionExpressionHoistingDrill();

console.log("\n=== closures ===");

// TODO: Implement makeCounter so each call increments a private count.
function makeCounter() {
  // TODO
}

const counter = makeCounter();
// TODO: Uncomment after implementation.
// console.log(counter()); // expected: 1
// console.log(counter()); // expected: 2

// TODO: Predict the output.
const varLoopFns = [];

for (var i = 0; i < 3; i += 1) {
  varLoopFns.push(() => i);
}

console.log(varLoopFns.map((fn) => fn())); // prediction:

// TODO: Rewrite the loop above using let so the result is [0, 1, 2].
const letLoopFns = [];
// TODO
console.log(letLoopFns.map((fn) => fn()));

console.log("\n=== this ===");

const user = {
  name: "Mina",
  regular() {
    return this.name;
  },
  arrow: () => this.name,
};

// TODO: Predict these before running.
console.log(user.regular()); // prediction:
console.log(user.arrow()); // prediction:

const detachedUser = {
  name: "Ada",
  getName() {
    return this.name;
  },
};

const getName = detachedUser.getName;
// TODO: Uncomment after predicting the result in Node/module strictness.
// console.log(getName());

// TODO: Create a bound version that returns "Ada".
const boundGetName = undefined; // TODO
console.log(boundGetName);

console.log("\n=== event loop ===");

// TODO: Predict output order before running.
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");

