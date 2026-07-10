// Events — the TypeScript lens
// Type-checks against lib.dom (npm run check); browser-runnable logic.

// ── addEventListener is typed per event NAME via event maps ──
const btn = document.createElement("button");
btn.addEventListener("click", (e) => {
  // e is MouseEvent — inferred from the "click" string literal!
  console.log(e.clientX, e.clientY, e.button);
});
btn.addEventListener("keydown", (e) => {
  console.log(e.key); // e: KeyboardEvent
});
// btn.addEventListener("clik", ...) // still compiles via the string overload — beware typos:
// the (type: string, listener: EventListener) fallback catches ALL names. Lint helps.

// ── e.target vs e.currentTarget: the typed difference ──
document.body.addEventListener("click", function (e) {
  const t = e.target; // EventTarget | null — could be ANY node in the subtree
  const ct = e.currentTarget; // typed as the listener's element in handler position
  if (t instanceof HTMLAnchorElement) {
    console.log("link click:", t.href); // narrowed — the delegation pattern, typed
  }
  void ct;
});

// ── A typed delegation helper ──
function delegate<K extends keyof HTMLElementEventMap, T extends HTMLElement>(
  root: HTMLElement,
  type: K,
  selector: string,
  ctor: new () => T,
  handler: (event: HTMLElementEventMap[K], match: T) => void,
): void {
  root.addEventListener(type, (e) => {
    const target = e.target;
    if (!(target instanceof Element)) return;
    const match = target.closest(selector);
    if (match instanceof ctor && root.contains(match)) handler(e, match);
  });
}
delegate(document.body, "click", "button[data-action]", HTMLButtonElement, (e, b) => {
  console.log(e.altKey, b.dataset.action); // e: MouseEvent, b: HTMLButtonElement
});

// ── Custom events: type the detail payload ──
interface LoginDetail {
  name: string;
  at: number;
}
const loginEvent = new CustomEvent<LoginDetail>("user:login", {
  bubbles: true,
  detail: { name: "Ann", at: Date.now() },
});
document.dispatchEvent(loginEvent);
// Listeners receive Event by default; declare the map entry for full typing:
declare global {
  interface DocumentEventMap {
    "user:login": CustomEvent<LoginDetail>;
  }
}
document.addEventListener("user:login", (e) => {
  console.log(e.detail.name); // typed! e is CustomEvent<LoginDetail> via the map
});

// ── AbortSignal-based listener cleanup (the modern removeEventListener) ──
const ac = new AbortController();
window.addEventListener("resize", () => console.log("resizing"), { signal: ac.signal });
window.addEventListener("scroll", () => {}, { signal: ac.signal, passive: true });
ac.abort(); // removes EVERY listener registered with this signal — no dangling refs

export {};
