// Implement a singly linked list.
// Goal: practice nodes, head/tail pointers, and walking a chain.
// Tip: draw the pointers before coding remove operations.

class Node {
  constructor(value) {
    // TODO: store value and next pointer.
  }
}

class SinglyLinkedList {
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
    // Tip: remember to update tail when the list becomes empty.
  }

  removeLast() {
    // TODO: remove and return the tail value.
    // Tip: singly linked lists need a walk to find the node before tail.
  }

  find(value) {
    // TODO: return the first node with this value, or null.
  }

  contains(value) {
    // TODO: return true if value is in the list.
  }

  get(index) {
    // TODO: return the value at index.
  }

  size() {
    // TODO: return number of nodes.
  }

  isEmpty() {
    // TODO: return true when the list has no nodes.
  }

  toArray() {
    // TODO: return values from head to tail.
  }
}

// Manual check idea:
// const list = new SinglyLinkedList();
// list.append(10);
// list.prepend(5);
// list.append(15);
// console.log(list.toArray()); // [5, 10, 15]

module.exports = SinglyLinkedList;

