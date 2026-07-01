// Implement tree traversal helpers.
// Goal: practice depth-first and breadth-first traversal.
// Tip: DFS often uses recursion. BFS often uses a queue.

function depthFirstPreOrder(root) {
  // TODO: return values in root-left-right order.
}

function depthFirstInOrder(root) {
  // TODO: return values in left-root-right order.
}

function depthFirstPostOrder(root) {
  // TODO: return values in left-right-root order.
}

function breadthFirst(root) {
  // TODO: return values level by level.
}

// Node shape idea:
// const root = {
//   value: 10,
//   left: { value: 5, left: null, right: null },
//   right: { value: 15, left: null, right: null },
// };
// console.log(depthFirstInOrder(root)); // [5, 10, 15]

module.exports = {
  depthFirstPreOrder,
  depthFirstInOrder,
  depthFirstPostOrder,
  breadthFirst,
};

