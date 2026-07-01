class Node {
  constructor(value) {
    this.value = value; // The value stored in the node
    this.next = null; // Pointer to the next node in the list
  }
}

class LinkedList {
  constructor() {
    this.top = null; // The top node of the linked list
    this.size = 0; // The size of the linked list
  }

  push(value) {
    const newNode = new Node(value); // Create a new node with the given value
    newNode.next = this.top; // Set the new node's next pointer to the current top node
    this.top = newNode; // Update the top pointer to the new node
    this.size++; // Increment the size of the linked list

    return this; // Return the linked list instance for chaining
  }

  pop() {
    if (!this.isEmpty()) {
      const poppedNode = this.top; // Store the current top node;
      const poppedValue = poppedNode.value; // Store the value of the popped node
      this.top = this.top.next; // Update the top pointer to the next node
      this.size--; // Decrement the size of the linked list

      return poppedValue; // Return the value of the popped node
    }

    return null; // Return null if the linked list is empty
  }

  peek() {
    return this.top ? this.top.value : null; // Return the value of the top node or null if the list is empty
  }

  isEmpty() {
    return this.size === 0; // Check if the size of the linked list is zero
  }

  getSize() {
    return this.size; // Return the size of the linked list
  }

  printStack() {
    let currentNode = this.top; // Start from the top node
    let stackValues = []; // Array to hold the values of the nodes

    while (currentNode) {
      stackValues.push(currentNode.value); // Add the current node's value to the array
      currentNode = currentNode.next; // Move to the next node
    }

    console.log(stackValues); // Print the array of values
  }
}

// Example Usage
const stack = new LinkedList();
stack.push(10);
stack.push(20);
stack.push(30);
stack.printStack();
console.log("Top Element:", stack.peek());
console.log("Popped Element:", stack.pop());
stack.printStack();