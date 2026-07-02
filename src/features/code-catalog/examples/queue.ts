import { CodeExample } from '../types';

export const queueJavascript: CodeExample = {
  structure: 'queue',
  language: 'javascript',
  title: 'Queue (JavaScript)',
  description: 'A FIFO (First-In-First-Out) queue. Note: Using an array for a queue is simple but shift() is O(N). For a true O(1) queue in JS, a linked list or pointer-based structure is needed.',
  source: `class Queue {
  constructor() {
    this.items = [];
    this.head = 0; // Pointer for the front to avoid O(N) shift()
  }

  // Add an element to the back of the queue
  enqueue(element) {
    this.items.push(element);
  }

  // Remove and return the front element
  dequeue() {
    if (this.isEmpty()) {
      throw new Error("Queue is empty");
    }
    const item = this.items[this.head];
    this.head++;
    
    // Optional: cleanup to prevent unbounded memory growth
    // If half the array is empty space, slice it off
    if (this.head > 10 && this.head * 2 >= this.items.length) {
      this.items = this.items.slice(this.head);
      this.head = 0;
    }
    
    return item;
  }

  // View the front element
  peek() {
    if (this.isEmpty()) {
      throw new Error("Queue is empty");
    }
    return this.items[this.head];
  }

  isEmpty() {
    return this.items.length - this.head === 0;
  }

  size() {
    return this.items.length - this.head;
  }
}`,
  testSource: `const q = new Queue();
q.enqueue("a");
q.enqueue("b");
console.log(q.dequeue()); // "a"
console.log(q.peek()); // "b"
console.log(q.size()); // 1`,
  complexity: {
    enqueue: { time: 'O(1)', space: 'O(1)', notes: 'Amortized O(1)' },
    dequeue: { time: 'O(1)', space: 'O(1)', notes: 'Amortized O(1) with pointer trick; O(N) if using array.shift()' },
    peek: { time: 'O(1)', space: 'O(1)' },
    isEmpty: { time: 'O(1)', space: 'O(1)' },
    size: { time: 'O(1)', space: 'O(1)' },
  },
  caveats: [
    'A naive implementation uses Array.prototype.shift() which is O(N) because it moves all remaining elements.',
    'This implementation tracks the `head` index to achieve O(1) dequeue.',
    'Memory cleanup is occasionally needed to prevent the array from growing indefinitely even when elements are removed.'
  ]
};

export const queueTypescript: CodeExample = {
  structure: 'queue',
  language: 'typescript',
  title: 'Queue (TypeScript)',
  description: 'A generic FIFO queue optimized with a head pointer to avoid O(N) array shifts.',
  source: `export class Queue<T> {
  private items: T[];
  private head: number;

  constructor() {
    this.items = [];
    this.head = 0;
  }

  enqueue(element: T): void {
    this.items.push(element);
  }

  dequeue(): T {
    if (this.isEmpty()) {
      throw new Error("Queue is empty");
    }
    const item = this.items[this.head];
    this.head++;

    if (this.head > 10 && this.head * 2 >= this.items.length) {
      this.items = this.items.slice(this.head);
      this.head = 0;
    }

    return item;
  }

  peek(): T {
    if (this.isEmpty()) {
      throw new Error("Queue is empty");
    }
    return this.items[this.head];
  }

  isEmpty(): boolean {
    return this.items.length - this.head === 0;
  }

  size(): number {
    return this.items.length - this.head;
  }
}`,
  testSource: `const q = new Queue<number>();
q.enqueue(1);
q.enqueue(2);
console.log(q.dequeue()); // 1
console.log(q.peek()); // 2`,
  complexity: {
    enqueue: { time: 'O(1)', space: 'O(1)', notes: 'Amortized O(1)' },
    dequeue: { time: 'O(1)', space: 'O(1)', notes: 'Amortized O(1)' },
    peek: { time: 'O(1)', space: 'O(1)' },
    isEmpty: { time: 'O(1)', space: 'O(1)' },
    size: { time: 'O(1)', space: 'O(1)' },
  },
  caveats: [
    'Generics (<T>) ensure type safety.',
    'Just like the JS version, we use a head pointer to avoid O(N) array shift().'
  ]
};

export const queuePython: CodeExample = {
  structure: 'queue',
  language: 'python',
  title: 'Queue (Python using collections.deque)',
  description: 'In Python, using a list for a queue is inefficient (list.pop(0) is O(N)). The standard and most efficient way is to use collections.deque.',
  source: `from collections import deque
from typing import TypeVar, Generic

T = TypeVar('T')

class Queue(Generic[T]):
    def __init__(self) -> None:
        # deque stands for "double-ended queue"
        self._items: deque[T] = deque()

    def enqueue(self, item: T) -> None:
        self._items.append(item)

    def dequeue(self) -> T:
        if self.is_empty():
            raise IndexError("dequeue from empty queue")
        # popleft() is O(1) vs list.pop(0) which is O(N)
        return self._items.popleft()

    def peek(self) -> T:
        if self.is_empty():
            raise IndexError("peek from empty queue")
        return self._items[0]

    def is_empty(self) -> bool:
        return len(self._items) == 0

    def size(self) -> int:
        return len(self._items)`,
  testSource: `q = Queue[str]()
q.enqueue("a")
q.enqueue("b")
print(q.dequeue()) # "a"
print(q.peek())    # "b"
print(q.size())    # 1`,
  complexity: {
    enqueue: { time: 'O(1)', space: 'O(1)' },
    dequeue: { time: 'O(1)', space: 'O(1)' },
    peek: { time: 'O(1)', space: 'O(1)' },
    is_empty: { time: 'O(1)', space: 'O(1)' },
    size: { time: 'O(1)', space: 'O(1)' },
  },
  caveats: [
    'Python lists are slow for queues because inserting or deleting at the front requires shifting all other elements (O(N)).',
    'collections.deque is implemented as a doubly-linked list under the hood, making append() and popleft() true O(1) operations.'
  ]
};

export const queueExamples = [queueJavascript, queueTypescript, queuePython];
