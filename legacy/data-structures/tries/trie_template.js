// Implement a trie.
// Goal: store words so prefix searches are fast.
// Tip: each node can have a Map of children and an isWord boolean.

class TrieNode {
  constructor() {
    // TODO: initialize children and end-of-word marker.
  }
}

class Trie {
  constructor() {
    // TODO: create a root node.
  }

  insert(word) {
    // TODO: add every character in word to the trie.
  }

  search(word) {
    // TODO: return true if word exists exactly.
  }

  startsWith(prefix) {
    // TODO: return true if any word starts with prefix.
  }

  collectWordsWithPrefix(prefix) {
    // TODO: return all words that start with prefix.
    // Tip: first walk to the prefix node, then DFS from there.
  }

  delete(word) {
    // TODO: remove a word without breaking other words that share its prefix.
  }
}

// Manual check idea:
// const trie = new Trie();
// trie.insert("car");
// trie.insert("cart");
// trie.insert("cat");
// console.log(trie.startsWith("ca")); // true
// console.log(trie.collectWordsWithPrefix("car")); // ["car", "cart"]

module.exports = Trie;

