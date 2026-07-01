// Implement an ArrayList-style data structure.
// Goal: practice wrapping a normal array with a small API.
// Tip: start with add, get, and size. Then handle insert/remove edge cases.

class ArrayList {
  constructor() {
    this.items = []; // Initialize an empty array to store items
    this.size = 0; // Initialize the size of the list to 0
  }

  add(value) {
    this.items.push(value); // Add the value to the end of the internal array
    this.size++; // Increment the size of the list

    return this; // Return the ArrayList instance for chaining
  }

  isOutOfBounds(index) {
    return index < 0 || index >= this.size; // Check if the index is out of bounds
  }

  checkForBoundsErrorAndThrow(index) {
    if (this.isOutOfBounds(index)) {
      throw new Error("Index out of bounds"); // Throw an error if the index is out of bounds
    }
  }

  insert(index, value) {
    this.checkForBoundsErrorAndThrow(index); // Check if the index is out of bounds and throw an error if it is

    this.items.splice(index, 0, value);
    this.size++; // Increment the size of the list

    return this; // Return the ArrayList instance for chaining
  }

  removeAt(index) {
    this.checkForBoundsErrorAndThrow(index); // Check if the index is out of bounds and throw an error if it is

    const removedValue = this.items.splice(index, 1)?.[0]; // Remove the item at the specified index and store the removed value
    this.size--; // Decrement the size of the list

    return removedValue; // Return the removed value
  }

  get(index) {
    this.checkForBoundsErrorAndThrow(index); // Check if the index is out of bounds and throw an error if it is

    return this.items[index]; // Return the value at the specified index
  }

  set(index, value) {
    this.checkForBoundsErrorAndThrow(index); // Check if the index is out of bounds and throw an error if it is
    const oldValue = this.items[index]; // Store the old value at the specified index
    this.items[index] = value; // Replace the value at the specified index with the new value

    return oldValue; // Return the old value
  }

  contains(value) {
    return this.items.includes(values); // Check if the value exists in the internal array
  }

  size() {
    return this.size;
  }

  isEmpty() {
    return this.size === 0; // Check if the size of the list is zero
  }

  toArray() {
    return [...this.items]; // Return a shallow copy of the internal array
  }
}

// Manual check idea:
const list = new ArrayList();
list.add("a");
list.add("c");
list.insert(1, "b");
console.log(list.toArray()); // ["a", "b", "c"]

module.exports = ArrayList;

