// Implement a set.
// Goal: store unique values.
// Tip: you can back this with an array first, then try a hash table later.

class CustomSet {
  constructor() {
    // TODO: initialize storage.
  }

  add(value) {
    // TODO: add value only if it is not already present.
  }

  has(value) {
    // TODO: return true if value exists.
  }

  delete(value) {
    // TODO: remove value and return true/false.
  }

  union(otherSet) {
    // TODO: return a new set with values from both sets.
  }

  intersection(otherSet) {
    // TODO: return a new set with values found in both sets.
  }

  difference(otherSet) {
    // TODO: return a new set with values in this set but not otherSet.
  }

  size() {
    // TODO: return number of unique values.
  }

  values() {
    // TODO: return all values as an array.
  }
}

// Manual check idea:
// const a = new CustomSet();
// const b = new CustomSet();
// a.add(1);
// a.add(2);
// b.add(2);
// b.add(3);
// console.log(a.intersection(b).values()); // [2]

module.exports = CustomSet;

