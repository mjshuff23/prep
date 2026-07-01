// Implement a stack.
// Goal: last in, first out.
// Tip: choose an array-backed stack first, then try a linked-list version later.

class Stack {
  constructor() {
    // TODO: initialize storage.
  }

  push(value) {
    // TODO: add value to the top.
  }

  pop() {
    // TODO: remove and return the top value.
  }

  peek() {
    // TODO: return the top value without removing it.
  }

  isEmpty() {
    // TODO: return true when stack has no items.
  }

  size() {
    // TODO: return number of items.
  }

  clear() {
    // TODO: remove every item.
  }
}

// Manual check idea:
// const stack = new Stack();
// stack.push(1);
// stack.push(2);
// console.log(stack.pop()); // 2
// console.log(stack.peek()); // 1

module.exports = Stack;

