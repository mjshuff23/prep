// A library module: named exports + a default export.

export const PI = 3.14159;

export function square(x) {
  return x * x;
}

// Exports can be listed at the end (and renamed):
function cube(x) {
  return x ** 3;
}
export { cube, cube as cubed }; // two names, same function

// ONE default per module — the "main thing" this module is about:
export default function area(r) {
  return PI * square(r);
}

// Module code runs ONCE, on first import, no matter how many importers:
console.log("  [math.js evaluated]");
