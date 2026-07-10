/*
  Outlier JavaScript Speed Drills

  Run with:
    node javascript-outlier-prep/outlier-speed-drills.js

  Suggested timing:
  - Predict output: 20-45 seconds each.
  - Coding prompts: 3-6 minutes each.
  - Explanation prompts: explain out loud in 45-60 seconds.
*/

console.log("=== explanation prompts ===");

/*
  TODO: Explain each out loud:

  1. What is a closure?
  2. What is hoisting?
  3. What is the difference between == and ===?
  4. What does async/await do?
  5. What is the event loop?
  6. Why can arrow functions change this behavior?
  7. What is the difference between || and ???
*/

console.log("\n=== predict output drills ===");

// TODO: Predict output before running.
console.log("drill 1");
console.log(typeof NaN);
console.log(Number.isNaN(NaN));
console.log(NaN === NaN);

// TODO: Predict output before running.
console.log("drill 2");
console.log([] == false);
console.log([] === false);
console.log(Boolean([]));

// TODO: Predict output before running.
console.log("drill 3");
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");

// TODO: Predict output before running.
console.log("drill 4");
function varDrill() {
  console.log(a);
  var a = 10;
}
varDrill();

// TODO: Uncomment after predicting whether it logs or throws.
console.log("drill 5");
function letDrill() {
  // console.log(a);
  let a = 10;
  console.log(a);
}
letDrill();

// TODO: Predict output before running.
console.log("drill 6");
const user = {
  name: "Ada",
  getName() {
    return this.name;
  },
};

const fn = user.getName;
// console.log(fn());

// TODO: Predict output before running.
console.log("drill 7");
console.log([10, 2, 1].sort());

// TODO: Predict output before running.
console.log("drill 8");
console.log([NaN].includes(NaN));
console.log([NaN].indexOf(NaN));

// TODO: Predict output before running.
console.log("drill 9");
const nested = [1, [2, [3]]];
console.log(nested.flat());
console.log(nested.flat(2));

// TODO: Predict output before running.
console.log("drill 10");
console.log([].every(Boolean));
console.log([].some(Boolean));

console.log("\n=== small coding drills ===");

// TODO: Implement groupBy.
function groupBy(items, getKey) {
  // TODO
}

const grouped = groupBy(
  [
    { type: "fruit", name: "apple" },
    { type: "veg", name: "carrot" },
    { type: "fruit", name: "banana" },
  ],
  (item) => item.type,
);

console.log(grouped);
// expected:
// {
//   fruit: [
//     { type: "fruit", name: "apple" },
//     { type: "fruit", name: "banana" },
//   ],
//   veg: [{ type: "veg", name: "carrot" }],
// }

// TODO: Implement unique for primitive values.
function unique(items) {
  // TODO
}

console.log(unique(["a", "b", "a"])); // expected: ["a", "b"]

// TODO: Implement chunk.
function chunk(items, size) {
  // TODO: Throw an error if size is not a positive integer.
}

console.log(chunk([1, 2, 3, 4, 5], 2)); // expected: [[1, 2], [3, 4], [5]]

// TODO: Implement debounce.
function debounce(fnToDebounce, delayMs) {
  // TODO
}

const debouncedLog = debounce((message) => {
  console.log(message);
}, 100);

// TODO: Uncomment after implementing debounce. Only "third" should log.
// debouncedLog("first");
// debouncedLog("second");
// debouncedLog("third");

// TODO: Implement getUserCity using optional chaining and nullish coalescing.
function getUserCity(userToRead) {
  // TODO
}

console.log(getUserCity({ profile: { address: { city: "Chicago" } } })); // expected: "Chicago"
console.log(getUserCity({ profile: {} })); // expected: "Unknown"

console.log("\n=== mini quiz comments ===");

/*
  TODO: Answer these from memory.

  1. Which array methods mutate the original array?
  2. What does reduce return?
  3. What is typeof []?
  4. What is the safest common way to check if a value is an array?
  5. Which runs first after sync code: Promise.then or setTimeout 0?
  6. Why does let fix the closure loop problem?
  7. What is the default depth of flat()?
  8. What is the difference between || and ???
*/

