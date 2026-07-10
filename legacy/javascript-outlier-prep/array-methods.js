/*
  Array Method Exercises

  Run with:
    node javascript-outlier-prep/array-methods.js

  Goal:
  Fill in each TODO. Keep an eye on whether a method mutates the original array.
*/

console.log("=== mutating vs non-mutating ===");

const numbersToSort = [10, 2, 1];

// a - b works because it returns a negative number if a < b, 0 if a === b, and a positive number if a > b. This is the expected behavior for the sort function.
const sortedNumbers = numbersToSort.toSorted((a, b) => a -b);
console.log(sortedNumbers); // expected: [1, 2, 10]
console.log(numbersToSort); // expected: [10, 2, 1]

const lettersToReverse = ["a", "b", "c"];

const reversedLetters = lettersToReverse.toReversed();
console.log(reversedLetters); // expected: ["c", "b", "a"]
console.log(lettersToReverse); // expected: ["a", "b", "c"]

console.log("\n=== map ===");

const prices = [10, 20, 30];

const pricesWithTax = prices.map(price => (price * 1.08).toFixed(1));
console.log(pricesWithTax); // expected: [10.8, 21.6, 32.4]

const names = ["ada", "linus", "grace"];

const uppercaseNames = names.map(name => name.toUpperCase());
console.log(uppercaseNames); // expected: ["ADA", "LINUS", "GRACE"]

console.log("\n=== filter ===");

const mixedNumbers = [1, 2, 3, 4, 5, 6];

const evenNumbers = mixedNumbers.filter(number => number % 2 === 0);
console.log(evenNumbers); // expected: [2, 4, 6]

const maybeValues = [0, 1, false, 2, "", 3, null, undefined, "ok"];

const truthyOnly = maybeValues.filter(value => !!value)
console.log(truthyOnly); // expected: [1, 2, 3, "ok"]

console.log("\n=== reduce ===");

const nums = [1, 2, 3, 4];

const sum = nums.reduce((acc, num) => acc + num, 0);
console.log(sum); // expected: 10

const tags = ["js", "react", "js", "css", "js"];

const tagCounts = tags.reduce((acc, tag) => {
  acc[tag] = (acc[tag] ?? 0) + 1;
  return acc;
}, {});
console.log(tagCounts); // expected: { js: 3, react: 1, css: 1 }

const orders = [
  { status: "open", id: 1 },
  { status: "closed", id: 2 },
  { status: "open", id: 3 },
];

// TODO: Group orders by status.
const ordersByStatus = orders.reduce((acc, order) => {
  const newAcc = { ...acc };
  if (order.status === 'open') {
    newAcc['open'] = [newAcc['open'], order] || [order];
  } else {
    newAcc['closed'] = [newAcc['closed'], order] || [order];
  }

  return newAcc;
}, {})
console.log(ordersByStatus);
// expected open ids: [1, 3]
// expected closed ids: [2]

const maxCandidates = [4, 9, 2, 11, 6];

// TODO: Find the max with reduce.
const max = undefined;
console.log(max); // expected: 11

console.log("\n=== flat ===");

const nestedOnce = [[1, 2], [3], [4, 5]];

// TODO: Flatten one level.
const flatOnce = undefined;
console.log(flatOnce); // expected: [1, 2, 3, 4, 5]

const nestedDeep = [1, [2, [3, [4]]]];

// TODO: Flatten completely.
const flatDeep = undefined;
console.log(flatDeep); // expected: [1, 2, 3, 4]

console.log("\n=== flatMap ===");

const phrases = ["hi there", "bye now"];

// TODO: Convert phrases to individual words.
const words = undefined;
console.log(words); // expected: ["hi", "there", "bye", "now"]

const flatMapNumbers = [1, 2, 3, 4];

// TODO: For odd numbers, return the number and its double. For even numbers, return nothing.
const oddsAndDoubles = undefined;
console.log(oddsAndDoubles); // expected: [1, 2, 3, 6]

console.log("\n=== find, findIndex, some, every ===");

const users = [
  { id: 1, active: false },
  { id: 2, active: true },
  { id: 3, active: false },
];

// TODO: Find the first active user.
const activeUser = undefined;
console.log(activeUser); // expected: { id: 2, active: true }

// TODO: Find the index of the first active user.
const activeUserIndex = undefined;
console.log(activeUserIndex); // expected: 1

// TODO: Check whether at least one user is active.
const hasActiveUser = undefined;
console.log(hasActiveUser); // expected: true

// TODO: Check whether every user is active.
const allUsersActive = undefined;
console.log(allUsersActive); // expected: false

console.log("\n=== includes vs indexOf ===");

// TODO: Predict these before running.
console.log([NaN].includes(NaN)); // prediction:
console.log([NaN].indexOf(NaN)); // prediction:

console.log("\n=== at ===");

const alphabet = ["a", "b", "c"];

// TODO: Get the last item with at.
const lastLetter = undefined;
console.log(lastLetter); // expected: "c"

console.log("\n=== slice vs splice ===");

const sliceSource = [1, 2, 3, 4];

// TODO: Use slice to get [2, 3] without mutating sliceSource.
const middle = undefined;
console.log(middle); // expected: [2, 3]
console.log(sliceSource); // expected: [1, 2, 3, 4]

const spliceSource = [1, 2, 3, 4];

// TODO: Use splice to remove [2, 3] and insert "x", "y".
const removed = undefined;
console.log(removed); // expected: [2, 3]
console.log(spliceSource); // expected: [1, "x", "y", 4]

console.log("\n=== chaining ===");

const students = [
  { name: "Ada", score: 90 },
  { name: "Lin", score: 70 },
  { name: "Bo", score: 95 },
];

// TODO: Keep scores >= 80, map to names, then sort alphabetically without mutating students.
const passingNames = undefined;
console.log(passingNames); // expected: ["Ada", "Bo"]

