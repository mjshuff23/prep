// Event loop - the TypeScript lens
// Run with: npx tsx part2-browser/06-misc/event-loop.ts

type Phase = "sync" | "microtask" | "macrotask";

interface Mark {
  phase: Phase;
  label: string;
}

const marks: Mark[] = [];

function record(phase: Phase, label: string): void {
  marks.push({ phase, label });
  console.log(`${marks.length}. ${phase}: ${label}`);
}

function waitForTimers(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 20));
}

function scheduleMicrotask(label: string, callback?: () => void): void {
  queueMicrotask(() => {
    record("microtask", label);
    callback?.();
  });
}

record("sync", "script start");

const timer: ReturnType<typeof setTimeout> = setTimeout(() => {
  record("macrotask", "timer callback");
}, 0);
void timer;

scheduleMicrotask("queueMicrotask callback");
Promise.resolve("promise.then callback").then((label) => record("microtask", label));
record("sync", "script end");

await waitForTimers();

async function typedAwaitSplit(value: number): Promise<number> {
  record("sync", "before await inside async function");
  const doubled = await Promise.resolve(value * 2);
  record("microtask", `after await with ${doubled}`);
  return doubled;
}

const resultPromise = typedAwaitSplit(21);
Promise.resolve().then(() => record("microtask", "sibling job after async call"));
const result = await resultPromise;
record("sync", `top-level await observed ${result}`);

// Expected:
// 1. sync: script start
// 2. sync: script end
// 3. microtask: queueMicrotask callback
// 4. microtask: promise.then callback
// 5. macrotask: timer callback
// 6. sync: before await inside async function
// 7. microtask: after await with 42
// 8. microtask: sibling job after async call
// 9. sync: top-level await observed 42
