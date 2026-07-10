// Event loop: microtasks and macrotasks
// Run with: node part2-browser/06-misc/event-loop.js

const waitForTimers = () => new Promise((resolve) => setTimeout(resolve, 20));

// -- 1. One turn: sync first, then every queued microtask, then timers --
console.log("-- 1. one turn --");
setTimeout(() => console.log("4 macrotask: setTimeout"), 0);
queueMicrotask(() => console.log("2 microtask: queueMicrotask"));
Promise.resolve().then(() => console.log("3 microtask: promise.then"));
console.log("1 sync: current script");
await waitForTimers();

// Expected:
// -- 1. one turn --
// 1 sync: current script
// 2 microtask: queueMicrotask
// 3 microtask: promise.then
// 4 macrotask: setTimeout

// -- 2. Microtasks drain completely before the next macrotask --
console.log("-- 2. nested microtasks --");
setTimeout(() => console.log("4 timer waits until microtasks are empty"), 0);
Promise.resolve().then(() => {
  console.log("1 first promise job");
  queueMicrotask(() => console.log("3 nested microtask"));
});
queueMicrotask(() => console.log("2 sibling microtask"));
await waitForTimers();

// Expected:
// -- 2. nested microtasks --
// 1 first promise job
// 2 sibling microtask
// 3 nested microtask
// 4 timer waits until microtasks are empty

// -- 3. await is a split point, even for an already-resolved value --
console.log("-- 3. await splits execution --");
async function splitAtAwait() {
  console.log("1 before await");
  await null;
  console.log("2 after await (microtask continuation)");
}
const split = splitAtAwait();
Promise.resolve().then(() => console.log("3 sibling promise job"));
await split;
await waitForTimers();

// Expected:
// -- 3. await splits execution --
// 1 before await
// 2 after await (microtask continuation)
// 3 sibling promise job

// -- 4. Error handling differs by queue --
console.log("-- 4. error surfaces --");
Promise.resolve()
  .then(() => {
    throw new Error("promise boom");
  })
  .catch((error) => console.log("3 caught promise:", error.message));
queueMicrotask(() => {
  try {
    throw new Error("microtask boom");
  } catch (error) {
    console.log("2 caught queueMicrotask:", error.message);
  }
});
console.log("1 handlers scheduled");
await waitForTimers();

// Expected:
// -- 4. error surfaces --
// 1 handlers scheduled
// 2 caught queueMicrotask: microtask boom
// 3 caught promise: promise boom
