// Implement a priority queue.
// Goal: remove the item with the highest priority first.
// Tip: make this simple first with an array scan, then try rebuilding it with a heap.

class Element {
  constructor(value, priority) {
    this.value = value;
    this.priority = priority;
  }
}

class PriorityQueue {
  constructor() {
    this.items = []; // Initialize an empty array to store items
  }

  enqueue(value, priority) {
    //  Higher numbers means higher priority.
    const newElement = new Element(value, priority);
    this.items.push(newElement);
  }

  dequeue() {
    // TODO: remove and return the highest-priority value.
    
  }

  peek() {
    // TODO: return the highest-priority value without removing it.
  }

  isEmpty() {
    // TODO: return true when there are no items.
  }

  size() {
    // TODO: return number of items.
  }
}

// Manual check idea:
// const pq = new PriorityQueue();
// pq.enqueue("normal", 5);
// pq.enqueue("urgent", 1);
// console.log(pq.dequeue()); // "urgent" if lower number means higher priority

module.exports = PriorityQueue;

