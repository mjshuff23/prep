// Document/DOM — the TypeScript lens
// Type-checks against lib.dom (npm run check); paste into a browser console/module to run.

// ── querySelector returns Element | null — and only `Element` unless you say more ──
const btn = document.querySelector("button"); // HTMLButtonElement | null (tag-name magic)
btn?.addEventListener("click", () => btn.disabled = true); // narrowed by ?.

const fancy = document.querySelector(".submit-btn"); // Element | null — no tag info!
// fancy.disabled // TS error: not on Element. Assert the concrete type at the boundary:
const fancyBtn = document.querySelector<HTMLButtonElement>(".submit-btn");
if (fancyBtn) fancyBtn.disabled = true; // now typed — but it's YOUR promise, verify wisely

// The runtime-checked version (belt and suspenders):
function q<T extends HTMLElement>(sel: string, ctor: new () => T): T {
  const el = document.querySelector(sel);
  if (!(el instanceof ctor)) throw new Error(`${sel} is not ${ctor.name}`);
  return el;
}
// const input = q("#email", HTMLInputElement); // input.value is typed AND verified

// ── getElementById is Element-typed too; createElement knows its tags ──
const div = document.createElement("div"); // HTMLDivElement — from the tag map
const canvas = document.createElement("canvas"); // HTMLCanvasElement
canvas.getContext("2d"); // typed: CanvasRenderingContext2D | null
// document.createElement("blink") // HTMLUnknownElement-ish — unknown tags degrade

// ── HTMLElementTagNameMap is the mechanism — extend it for custom elements ──
declare global {
  interface HTMLElementTagNameMap {
    "review-card": HTMLElement & { rating: number };
  }
}
const card = document.createElement("review-card");
card.rating = 5; // typed via the map entry
console.log(card.rating);

// ── NodeList vs HTMLCollection vs arrays ──
const nodeList = document.querySelectorAll("li"); // NodeListOf<HTMLLIElement> — iterable, has forEach
const collection = document.getElementsByTagName("li"); // HTMLCollectionOf — LIVE, no forEach
const asArray = [...nodeList]; // spread both into real arrays for map/filter
console.log(nodeList.length === collection.length, asArray.length >= 0);

// ── dataset and style are typed loosely: string in, string out ──
const el = document.createElement("section");
el.dataset.userId = "42"; // fine — dataset is DOMStringMap (all strings)
el.style.width = "100px"; // string CSS values; el.style.width = 100 is a TS error
el.hidden = true; // boolean DOM properties are properly boolean

// ── Geometry APIs return DOMRect — numbers, not strings like style ──
function centerOf(target: Element): { x: number; y: number } {
  const r = target.getBoundingClientRect();
  return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
}
console.log(typeof centerOf(el).x); // number

export {};
