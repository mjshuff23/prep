import { CodeExample } from '../types';

export const stackJavascript: CodeExample = {
  structure: 'stack',
  language: 'javascript',
  title: 'Stack (JavaScript)',
  description: 'A classic LIFO (Last-In-First-Out) stack implemented using a JavaScript class and an underlying array.',
  source: `class Stack {
  constructor() {
    this.items = [];
  }

  // Push an element onto the stack
  push(element) {
    this.items.push(element);
  }

  // Remove and return the top element
  pop() {
    if (this.isEmpty()) {
      throw new Error("Stack is empty");
    }
    return this.items.pop();
  }

  // Return the top element without removing it
  peek() {
    if (this.isEmpty()) {
      throw new Error("Stack is empty");
    }
    return this.items[this.items.length - 1];
  }

  // Check if the stack is empty
  isEmpty() {
    return this.items.length === 0;
  }

  // Get the size of the stack
  size() {
    return this.items.length;
  }
}`,
  testSource: `const stack = new Stack();
stack.push(10);
stack.push(20);
console.log(stack.peek()); // 20
console.log(stack.pop()); // 20
console.log(stack.size()); // 1
console.log(stack.isEmpty()); // false`,
  complexity: {
    push: { time: 'O(1)', space: 'O(1)', notes: 'Amortized O(1) time due to JS dynamic arrays' },
    pop: { time: 'O(1)', space: 'O(1)' },
    peek: { time: 'O(1)', space: 'O(1)' },
    isEmpty: { time: 'O(1)', space: 'O(1)' },
    size: { time: 'O(1)', space: 'O(1)' },
  },
  caveats: [
    'JavaScript arrays handle dynamic resizing automatically.',
    'We throw an Error on pop/peek when empty instead of returning undefined, to catch logic bugs early.'
  ]
};

export const stackTypescript: CodeExample = {
  structure: 'stack',
  language: 'typescript',
  title: 'Stack (TypeScript)',
  description: 'A generic Stack class leveraging TypeScript for type safety.',
  source: `export class Stack<T> {
  private items: T[];

  constructor() {
    this.items = [];
  }

  push(element: T): void {
    this.items.push(element);
  }

  pop(): T {
    if (this.isEmpty()) {
      throw new Error("Stack is empty");
    }
    return this.items.pop() as T;
  }

  peek(): T {
    if (this.isEmpty()) {
      throw new Error("Stack is empty");
    }
    return this.items[this.items.length - 1];
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }
}`,
  testSource: `const stack = new Stack<number>();
stack.push(10);
stack.push(20);
console.log(stack.peek()); // 20
console.log(stack.pop()); // 20
console.log(stack.size()); // 1`,
  complexity: {
    push: { time: 'O(1)', space: 'O(1)', notes: 'Amortized O(1) time' },
    pop: { time: 'O(1)', space: 'O(1)' },
    peek: { time: 'O(1)', space: 'O(1)' },
    isEmpty: { time: 'O(1)', space: 'O(1)' },
    size: { time: 'O(1)', space: 'O(1)' },
  },
  caveats: [
    'Generics (<T>) ensure that the stack only contains elements of a single, specified type.',
    'Under the hood, it still uses a dynamic JS array.'
  ]
};

export const stackPython: CodeExample = {
  structure: 'stack',
  language: 'python',
  title: 'Stack (Python)',
  description: 'A LIFO stack in Python using a list, heavily relying on list.append() and list.pop().',
  source: `from typing import TypeVar, Generic

T = TypeVar('T')

class Stack(Generic[T]):
    def __init__(self) -> None:
        self._items: list[T] = []

    def push(self, item: T) -> None:
        self._items.append(item)

    def pop(self) -> T:
        if self.is_empty():
            raise IndexError("pop from empty stack")
        return self._items.pop()

    def peek(self) -> T:
        if self.is_empty():
            raise IndexError("peek from empty stack")
        return self._items[-1]

    def is_empty(self) -> bool:
        return len(self._items) == 0

    def size(self) -> int:
        return len(self._items)`,
  testSource: `stack = Stack[int]()
stack.push(10)
stack.push(20)
print(stack.peek())  # 20
print(stack.pop())   # 20
print(stack.size())  # 1`,
  complexity: {
    push: { time: 'O(1)', space: 'O(1)', notes: 'Amortized O(1) time due to dynamic array resizing' },
    pop: { time: 'O(1)', space: 'O(1)' },
    peek: { time: 'O(1)', space: 'O(1)' },
    is_empty: { time: 'O(1)', space: 'O(1)' },
    size: { time: 'O(1)', space: 'O(1)' },
  },
  caveats: [
    'Python lists are essentially dynamic arrays.',
    'Appending to the end and popping from the end are O(1) operations, making lists perfectly suitable for Stacks.'
  ]
};

export const stackExamples = [stackJavascript, stackTypescript, stackPython];
