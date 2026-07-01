// Implement a queue.
// Goal: first in, first out.
// Tip: avoid Array.shift for a serious implementation. A front index is a nice upgrade.

class Queue {
  constructor() {
    this.items = []; // Initialize an empty array to store items
    this.front = 0; // Initialize the front index
  }

  enqueue(value) {
    this.items.push(value);
  }

  dequeue() {
    return this.items[this.front++];
  }

  peek() {
    return this.items[this.front];
  }

  isEmpty() {
    return this.front >= this.items.length;
  }

  size() {
    return this.items.length - this.front;
  }

  clear() {
    this.items = [];
    this.front = 0;
  }
}

// Manual check idea:
const queue = new Queue();
queue.enqueue("first");
queue.enqueue("second");
console.log(queue.dequeue()); // "first"

module.exports = Queue;

