// Promises & async/await — the TypeScript lens
// Run: npx tsx promises.ts

// ── Promise<T> is generic; async functions must return Promise<T> ──
async function getUser(id: number): Promise<{ id: number; name: string }> {
  await new Promise((r) => setTimeout(r, 5));
  return { id, name: "Ann" }; // return type checked against the T in Promise<T>
}
const user = await getUser(1); // await UNWRAPS: user is { id, name }, not a promise
console.log(user.name); // Ann

// ── The floating-promise problem: forgetting await compiles silently... ──
async function save(): Promise<string> {
  return "saved";
}
const oops = save(); // Promise<string> assigned where you maybe wanted string
// console.log(oops.toUpperCase()); // TS error — caught when you USE it wrongly
console.log((await oops).toUpperCase()); // SAVED
// ...but `save();` as a bare statement is legal TS. Lint rule no-floating-promises
// is the real guard — TS itself won't flag fire-and-forget calls.

// ── Rejections are UNTYPED: Promise<T> has no error channel ──
// .catch(e => ...) — e is unknown/any. Same story as try/catch. If the failure type
// matters, encode it in the VALUE (Result pattern from ch 10) or narrow at the site.

// ── Promise.all: tuple in, tuple out ──
const [n, s] = await Promise.all([
  Promise.resolve(42),
  Promise.resolve("hello"),
] as const); // n: number, s: string — heterogeneous types preserved positionally
console.log(n, s); // 42 hello

// ── allSettled: the result is a typed discriminated union ──
const settled = await Promise.allSettled([
  Promise.resolve(1),
  Promise.reject(new Error("nope")),
]);
for (const r of settled) {
  if (r.status === "fulfilled") console.log("ok:", r.value); // ok: 1
  else console.log("err:", (r.reason as Error).message); // err: nope
  // r.value only exists after narrowing on status — the union enforces the check.
}

// ── Awaited<T>: unwrap promise types recursively ──
type A = Awaited<Promise<Promise<number>>>; // number
type FnResult = Awaited<ReturnType<typeof getUser>>; // { id: number; name: string }
const fr: FnResult = { id: 2, name: "Bea" };
console.log(fr.id); // 2

// ── Typed promisify (Node util.promisify is typed via overloads) ──
function promisify<A extends unknown[], R>(
  fn: (...args: [...A, (err: Error | null, result: R) => void]) => void,
): (...args: A) => Promise<R> {
  return (...args) =>
    new Promise((resolve, reject) => {
      fn(...args, (err, result) => (err ? reject(err) : resolve(result)));
    });
}
const loadP = promisify((name: string, cb: (e: Error | null, r: string) => void) =>
  setTimeout(() => cb(null, `${name} loaded`), 5),
);
console.log(await loadP("module")); // module loaded — arg & result types preserved

// ── AbortSignal: typed cancellation (promises aren't cancellable by themselves) ──
function fetchWithTimeout(ms: number): Promise<string> {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(new Error("deadline")), ms);
  return new Promise<string>((resolve, reject) => {
    ac.signal.addEventListener("abort", () => reject(ac.signal.reason));
    setTimeout(() => resolve("data"), ms * 2); // pretend slow work
  }).finally(() => clearTimeout(t));
}
console.log(await fetchWithTimeout(10).catch((e: Error) => `failed: ${e.message}`));
// failed: deadline
