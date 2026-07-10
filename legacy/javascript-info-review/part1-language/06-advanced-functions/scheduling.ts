// Scheduling — the TypeScript lens
// Run: npx tsx scheduling.ts

// ── The timer-ID type trap: Node vs browser disagree ──
// Browser: setTimeout returns number. Node: NodeJS.Timeout object.
// Portable code infers instead of hardcoding either:
const id: ReturnType<typeof setTimeout> = setTimeout(() => {}, 1000);
clearTimeout(id); // works in both worlds

// ── Typed debounce: the canonical scheduling utility ──
function debounce<A extends unknown[]>(fn: (...args: A) => void, ms: number) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return (...args: A): void => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}
const save = debounce((doc: string) => console.log("saved:", doc), 30);
save("draft 1");
save("draft 2");
save("final"); // only this one fires, 30ms after the last call
// save(42); // TS error: parameter types flow through the generic

// ── Typed throttle: leading call + trailing catch-up ──
function throttle<A extends unknown[]>(fn: (...args: A) => void, ms: number) {
  let cooling = false;
  let queued: A | null = null;
  return function wrapper(...args: A): void {
    if (cooling) {
      queued = args;
      return;
    }
    fn(...args);
    cooling = true;
    setTimeout(() => {
      cooling = false;
      if (queued) {
        const q = queued;
        queued = null;
        wrapper(...q);
      }
    }, ms);
  };
}
const paint = throttle((x: number) => console.log("paint at", x), 25);
paint(1); // paint at 1 — immediately
paint(2);
paint(3); // paint at 3 — trailing call after 25ms (2 was superseded)

// ── Promisified delay: the modern replacement for callback timers ──
const delay = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));
(async () => {
  await delay(60);
  console.log("after everything above settles");
})();

// Node extra: import { setTimeout as sleep } from "node:timers/promises" does this
// natively, with AbortSignal support for cancellation.
