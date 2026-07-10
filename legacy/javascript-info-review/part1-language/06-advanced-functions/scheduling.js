// Scheduling: setTimeout and setInterval — javascript.info 6.8
// Run: node scheduling.js

// ── Basics: schedule, cancel, pass args ──
const id = setTimeout((who) => console.log(`never runs for ${who}`), 50, "Ann");
clearTimeout(id);

// ── Zero-delay ≠ immediate: it queues AFTER the current synchronous code ──
setTimeout(() => console.log("3: timeout 0"), 0);
console.log("1: sync first");
// (microtasks — Promise.then — would run between: see chapter 11)
Promise.resolve().then(() => console.log("2: microtask beats macrotask"));

// ── setInterval vs nested setTimeout ──
// setInterval fires by the CLOCK: if the callback takes long, gaps shrink
// (or callbacks queue back-to-back). Nested setTimeout guarantees a fixed
// PAUSE BETWEEN runs and lets you reschedule adaptively:
let ticks = 0;
function tick() {
  ticks++;
  if (ticks < 3) setTimeout(tick, 20); // next run scheduled AFTER this one finishes
  else report();
}
setTimeout(tick, 20);

function report() {
  console.log(`4: ticked ${ticks} times`); // 4: ticked 3 times
  demoThisLoss();
}

// ── The this-loss classic (same as chapter 04, in scheduling form) ──
function demoThisLoss() {
  const user = {
    name: "John",
    sayHi() {
      console.log(`5: Hi from ${this?.name}`);
    },
  };
  setTimeout(user.sayHi, 10); // detached → "5: Hi from undefined" (timer calls it bare)
  setTimeout(() => user.sayHi(), 20); // fix — "5: Hi from John"
  setTimeout(demoDrift, 30);
}

// ── Timers are MINIMUM delays, and they clamp/drift ──
function demoDrift() {
  const start = Date.now();
  setTimeout(() => {
    const elapsed = Date.now() - start;
    console.log(`6: asked 10ms, got ~${elapsed >= 10 ? ">=10" : "<10"}ms`); // >=10
    // Browsers also clamp nested timers to >=4ms after 5 levels, and background
    // tabs to >=1000ms. Never use timers as a clock — measure Date.now() deltas.
    console.log("7: done");
  }, 10);
}

// ── Garbage-collection note ──
// A scheduled callback (and everything it closes over) is retained until it fires
// or is cleared. Forgotten setIntervals are a classic leak: ALWAYS keep the id
// and clearInterval when the consumer goes away.

// Expected order: 1, 2, 3, 4, 5 (undefined), 5 (John), 6, 7
