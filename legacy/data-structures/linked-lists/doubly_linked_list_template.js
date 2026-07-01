// Implement a doubly linked list.
// Goal: practice prev and next pointers.
// Tip: every insert/remove usually updates two neighbors, not one.

class DoublyNode {
  constructor(value) {
    // TODO: store value, next pointer, and prev pointer.
  }
}

class DoublyLinkedList {
  constructor() {
    // TODO: track head, tail, and size.
  }

  append(value) {
    // TODO: add value to the tail.
  }

  prepend(value) {
    // TODO: add value to the head.
  }

  removeFirst() {
    // TODO: remove and return the head value.
  }

  removeLast() {
    // TODO: remove and return the tail value.
  }

  insertAfter(targetValue, newValue) {
    // TODO: find targetValue and insert newValue after it.
    // Tip: handle inserting after the tail.
  }

  remove(value) {
    // TODO: remove the first node with this value and return true/false.
  }

  toArray() {
    // TODO: return values from head to tail.
  }

  toReverseArray() {
    // TODO: return values from tail to head.
  }
}

// Manual check idea:
// const list = new DoublyLinkedList();
// list.append("a");
// list.append("c");
// list.insertAfter("a", "b");
// console.log(list.toArray()); // ["a", "b", "c"]
// console.log(list.toReverseArray()); // ["c", "b", "a"]

module.exports = DoublyLinkedList;

