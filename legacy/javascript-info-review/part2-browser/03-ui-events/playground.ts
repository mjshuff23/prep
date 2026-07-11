function byId<T extends HTMLElement>(id: string, ctor: new () => T): T {
  const el = document.getElementById(id);
  if (!(el instanceof ctor)) throw new Error(`#${id} is not ${ctor.name}`);
  return el;
}

function log(el: HTMLElement, ...args: unknown[]): void {
  el.textContent += `${args.join(" ")}\n`;
  el.scrollTop = el.scrollHeight;
}

const mouseBtn = byId("mouseBtn", HTMLButtonElement);
const mouseOut = byId("mouseOut", HTMLOutputElement);
const hoverZone = byId("hoverZone", HTMLDivElement);
const hoverOut = byId("hoverOut", HTMLOutputElement);
const dragMe = byId("dragMe", HTMLDivElement);
const dropTarget = byId("dropTarget", HTMLDivElement);
const dragOut = byId("dragOut", HTMLOutputElement);
const kbdInput = byId("kbdInput", HTMLInputElement);
const kbdOut = byId("kbdOut", HTMLOutputElement);
const scrollOut = byId("scrollOut", HTMLOutputElement);

// 1 -- Order for dblclick: mousedown mouseup click x2 then dblclick.
for (const type of ["mousedown", "mouseup", "click", "dblclick", "contextmenu"]) {
  mouseBtn.addEventListener(type, (event) => {
    if (!(event instanceof MouseEvent)) return;
    const mods = [
      event.shiftKey ? "shift" : "",
      event.ctrlKey ? "ctrl" : "",
      event.altKey ? "alt" : "",
      event.metaKey ? "meta" : "",
    ].filter(Boolean).join("+");
    log(mouseOut, `${type} button=${event.button}${mods ? " +" + mods : ""}`);
    if (type === "contextmenu") event.preventDefault(); // suppress the browser menu here
  });
}

// 2 -- Hover the A/B/C children and compare
hoverZone.addEventListener("mouseover", (event) => {
  const target = event.target instanceof Element
    ? event.target.textContent?.trim().slice(0, 12) ?? ""
    : "(unknown)";
  const related = event.relatedTarget instanceof Element ? event.relatedTarget.tagName : "null";
  log(hoverOut, `mouseover: target=${target} relatedTarget=${related}`);
});
hoverZone.addEventListener("mouseenter", () => {
  log(hoverOut, "mouseenter: fires ONCE per entry into the zone, children don't retrigger");
});

// 3 -- The canonical drag'n'drop algorithm, in pointer events:
// down -> setPointerCapture -> move (position by pageX/Y minus grab offset) -> up
dragMe.addEventListener("pointerdown", (event) => {
  const rect = dragMe.getBoundingClientRect();
  const shiftX = event.clientX - rect.left; // grab point inside the element
  const shiftY = event.clientY - rect.top; // without this, the corner "jumps" to the cursor

  dragMe.setPointerCapture(event.pointerId); // capture: all moves come here even
  // when the pointer leaves the element -- no document-level listeners needed!

  const onMove = (ev: PointerEvent): void => {
    const parentRect = dragMe.offsetParent?.getBoundingClientRect();
    dragMe.style.left = `${ev.pageX - shiftX - (parentRect?.left ?? 0) - window.pageXOffset}px`;
    dragMe.style.top = `${ev.pageY - shiftY - (parentRect?.top ?? 0) - window.pageYOffset}px`;
    // droppable detection: the dragged element is under the cursor, so PEEK below it:
    dragMe.hidden = true;
    const below = document.elementFromPoint(ev.clientX, ev.clientY);
    dragMe.hidden = false;
    dropTarget.classList.toggle("over", Boolean(below?.closest?.("#dropTarget")));
  };
  const onUp = (): void => {
    dragMe.removeEventListener("pointermove", onMove);
    dragMe.removeEventListener("pointerup", onUp);
    log(dragOut, dropTarget.classList.contains("over") ? "dropped ON target" : "released elsewhere");
    dropTarget.classList.remove("over");
  };
  dragMe.addEventListener("pointermove", onMove);
  dragMe.addEventListener("pointerup", onUp);
  // HTML5 native DnD exists for cross-window/file drags but is clunkier;
  // pointer events are the go-to for in-page dragging.
});

// 4 -- key = the MEANING ("z", "Z"); code = the PHYSICAL KEY ("KeyZ")
kbdInput.addEventListener("keydown", (event) => {
  log(kbdOut, `key="${event.key}" code="${event.code}" repeat=${event.repeat}`);
  if (event.ctrlKey && event.code === "KeyZ") {
    log(kbdOut, "  hotkey by code -- works on any layout position");
  }
  if (event.key === "ArrowDown") event.preventDefault(); // stop caret/scroll default
});

// 5 -- scroll fires A LOT -- throttle before doing work
let scrollTicking = false;
document.addEventListener("scroll", () => {
  if (scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(() => { // rAF-throttle: at most once per frame
    log(scrollOut, "scrollY =", Math.round(window.scrollY));
    scrollTicking = false;
  });
}, { passive: true }); // passive: never blocks scrolling (can't preventDefault)

export {};
