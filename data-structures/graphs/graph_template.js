// Implement an undirected graph using an adjacency list.
// Goal: practice vertices, edges, BFS, and DFS.
// Tip: a Map from vertex to Set of neighbors works nicely.

class Graph {
  constructor() {
    // TODO: initialize adjacency list.
  }

  addVertex(vertex) {
    // TODO: add vertex if it does not already exist.
  }

  addEdge(vertexA, vertexB) {
    // TODO: connect vertexA and vertexB.
    // Tip: for an undirected graph, add both directions.
  }

  removeEdge(vertexA, vertexB) {
    // TODO: disconnect vertexA and vertexB.
  }

  removeVertex(vertex) {
    // TODO: remove vertex and all edges pointing to it.
  }

  neighbors(vertex) {
    // TODO: return an array of neighbors.
  }

  breadthFirst(start) {
    // TODO: return vertices in BFS order.
  }

  depthFirst(start) {
    // TODO: return vertices in DFS order.
  }
}

// Manual check idea:
// const graph = new Graph();
// graph.addEdge("A", "B");
// graph.addEdge("A", "C");
// graph.addEdge("B", "D");
// console.log(graph.breadthFirst("A")); // ["A", "B", "C", "D"]

module.exports = Graph;

