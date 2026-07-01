// Implement a min heap.
// Goal: the smallest value is always at the root.
// Tip: store the heap in an array. Children of index i are 2*i+1 and 2*i+2.

class MinHeap {
  constructor() {
    // TODO: initialize array storage.
  }

  insert(value) {
    // TODO: add value and bubble it up.
  }

  extractMin() {
    // TODO: remove and return the smallest value.
    // Tip: move the last value to the root, then bubble it down.
  }

  peek() {
    // TODO: return the smallest value without removing it.
  }

  size() {
    // TODO: return number of values.
  }

  isEmpty() {
    // TODO: return true when heap has no values.
  }

  parentIndex(index) {
    // TODO: return parent index.
  }

  leftChildIndex(index) {
    // TODO: return left child index.
  }

  rightChildIndex(index) {
    // TODO: return right child index.
  }
}

// Manual check idea:
// const heap = new MinHeap();
// [5, 3, 8, 1].forEach((value) => heap.insert(value));
// console.log(heap.extractMin()); // 1

module.exports = MinHeap;

