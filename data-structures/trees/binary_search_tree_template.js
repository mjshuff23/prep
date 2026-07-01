// Implement a binary search tree.
// Goal: smaller values go left, larger values go right.
// Tip: get insert/search working before removal. Removal is the spicy one.

class TreeNode {
  constructor(value) {
    // TODO: store value, left child, and right child.
  }
}

class BinarySearchTree {
  constructor() {
    // TODO: track root and size.
  }

  insert(value) {
    // TODO: insert value into the tree.
  }

  contains(value) {
    // TODO: return true if value exists.
  }

  min() {
    // TODO: return the smallest value.
  }

  max() {
    // TODO: return the largest value.
  }

  remove(value) {
    // TODO: remove value if it exists.
    // Tip: handle leaf, one-child, and two-child nodes separately.
  }

  inOrder() {
    // TODO: return values in sorted order.
  }

  preOrder() {
    // TODO: return values in root-left-right order.
  }

  postOrder() {
    // TODO: return values in left-right-root order.
  }

  height() {
    // TODO: return the height of the tree.
  }
}

// Manual check idea:
// const tree = new BinarySearchTree();
// [8, 3, 10, 1, 6, 14].forEach((value) => tree.insert(value));
// console.log(tree.inOrder()); // [1, 3, 6, 8, 10, 14]

module.exports = BinarySearchTree;

