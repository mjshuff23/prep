// Recursion & stack + Rest parameters & spread — javascript.info 6.1, 6.2
// Run: node rest-spread-recursion.js

// ── Rest: gather arguments into a real array (unlike `arguments`) ──
function sumAll(label, ...nums) {
  // rest must be LAST
  return `${label}: ${nums.reduce((a, b) => a + b, 0)}`;
}
console.log(sumAll("total", 1, 2, 3)); // total: 6

// `arguments` is array-like, includes everything, and arrows don't have it:
function oldSchool() {
  console.log(arguments.length, Array.isArray(arguments)); // 2 false
}
oldSchool("a", "b");

// ── Spread: expand any iterable into arguments / array / object literals ──
const nums = [3, 5, 1];
console.log(Math.max(...nums)); // 5 — replaces .apply
console.log([...nums, 10, ...[20]]); // [ 3, 5, 1, 10, 20 ]
console.log([..."hi"]); // [ 'h', 'i' ] — any iterable
const merged = { a: 1, ...{ b: 2 }, a: 9 }; // later spread/props win
console.log(merged); // { a: 9, b: 2 }

// Spread is SHALLOW copy (same as Object.assign) — see chapter 04.

// ── Recursion: every call adds a stack frame ──
function pow(x, n) {
  return n === 1 ? x : x * pow(x, n - 1);
}
console.log(pow(2, 10)); // 1024

// Stack depth is finite:
function depth(n) {
  try {
    return depth(n + 1);
  } catch {
    return n;
  }
}
console.log(depth(0) > 5000); // true (~10k typical; NOT a number to rely on)
// JS engines (except Safari/JSC in some modes) do NOT do tail-call optimization
// in practice — deep recursion must become a loop or an explicit stack.

// ── Recursive traversal: the natural fit ──
const company = {
  sales: [{ name: "John", salary: 1000 }, { name: "Alice", salary: 1600 }],
  development: {
    sites: [{ name: "Peter", salary: 2000 }],
    internals: [{ name: "Jack", salary: 1300 }],
  },
};
function sumSalaries(dept) {
  if (Array.isArray(dept)) return dept.reduce((s, e) => s + e.salary, 0);
  return Object.values(dept).reduce((s, sub) => s + sumSalaries(sub), 0);
}
console.log(sumSalaries(company)); // 5900

// ── Recursion → iteration with an explicit stack (when depth is unbounded) ──
function sumSalariesIterative(dept) {
  let total = 0;
  const stack = [dept];
  while (stack.length) {
    const cur = stack.pop();
    if (Array.isArray(cur)) total += cur.reduce((s, e) => s + e.salary, 0);
    else stack.push(...Object.values(cur));
  }
  return total;
}
console.log(sumSalariesIterative(company)); // 5900

// ── Linked list flavor ──
const list = { value: 1, next: { value: 2, next: { value: 3, next: null } } };
const printList = (node) => (node ? (console.log(node.value), printList(node.next)) : undefined);
printList(list); // 1 / 2 / 3
