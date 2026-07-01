// Implement a hash table.
// Goal: practice hashing keys into buckets and handling collisions.
// Tip: start with string keys. Add resizing only after set/get/remove work.

class HashTable {
  constructor(capacity = 16) {
    // TODO: create buckets and track size.
  }

  hash(key) {
    // TODO: convert a string key into a bucket index.
    // Tip: loop through characters and keep the result inside capacity.
  }

  set(key, value) {
    // TODO: insert or update a key/value pair.
    // Tip: collisions can be handled by storing arrays in each bucket.
  }

  get(key) {
    // TODO: return the value for key, or undefined.
  }

  has(key) {
    // TODO: return true if key exists.
  }

  remove(key) {
    // TODO: remove key and return true/false.
  }

  keys() {
    // TODO: return all keys.
  }

  values() {
    // TODO: return all values.
  }

  size() {
    // TODO: return number of stored key/value pairs.
  }
}

// Manual check idea:
// const table = new HashTable();
// table.set("name", "Ada");
// table.set("language", "JavaScript");
// console.log(table.get("name")); // "Ada"

module.exports = HashTable;

