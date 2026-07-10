// Demonstrates: live bindings + shared singleton state.

export let count = 0; // importers see a LIVE view of this binding

export function increment() {
  count++; // reassigning here is visible to every importer
}

// Because a module is evaluated once and cached, this object is a singleton —
// every importer gets the SAME object (classic config/registry pattern):
export const registry = new Map();
