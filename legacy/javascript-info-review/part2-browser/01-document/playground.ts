function byId<T extends HTMLElement>(id: string, ctor: new () => T): T {
  const el = document.getElementById(id);
  if (!(el instanceof ctor)) throw new Error(`#${id} is not ${ctor.name}`);
  return el;
}

function log(el: HTMLElement, ...args: unknown[]): void {
  el.textContent += `${args.join(" ")}\n`;
}

const walkBtn = byId("walkBtn", HTMLButtonElement);
const walkOut = byId("walkOut", HTMLOutputElement);
const attrBtn = byId("attrBtn", HTMLButtonElement);
const attrOut = byId("attrOut", HTMLOutputElement);
const attrInput = byId("attrInput", HTMLInputElement);
const addBtn = byId("addBtn", HTMLButtonElement);
const clearBtn = byId("clearBtn", HTMLButtonElement);
const list = byId("list", HTMLOListElement);
const xssBtn = byId("xssBtn", HTMLButtonElement);
const xssHtml = byId("xssHtml", HTMLOutputElement);
const xssText = byId("xssText", HTMLOutputElement);
const geoBtn = byId("geoBtn", HTMLButtonElement);
const geoOut = byId("geoOut", HTMLOutputElement);
const sized = byId("sized", HTMLDivElement);

// 1 -- Walking & searching: querySelector vs getElementsBy* (live!)
walkBtn.addEventListener("click", () => {
  walkOut.textContent = "";
  const ul = byId("fruits", HTMLUListElement);
  const liveItems = ul.getElementsByTagName("li");
  log(walkOut, "children:", ul.children.length, "| first:", ul.firstElementChild?.textContent ?? "");
  log(walkOut, "closest section:", ul.closest("section")?.id ?? "(missing)");
  log(walkOut, "matches('ul#fruits'):", ul.matches("ul#fruits"));
  const before = liveItems.length;
  ul.append(Object.assign(document.createElement("li"), { textContent: "Mango" }));
  log(walkOut, `live collection grew by itself: ${before} -> ${liveItems.length}`);
  // NodeList from querySelectorAll would still show the OLD length -- static snapshot.
});

// 2 -- Attributes vs properties: attribute = initial (HTML), property = current
attrBtn.addEventListener("click", () => {
  attrOut.textContent = "";
  log(attrOut, "getAttribute('value'):", attrInput.getAttribute("value") ?? "(missing)");
  log(attrOut, "input.value property:", attrInput.value);
  attrInput.dataset.demo = "hi";
  log(attrOut, "data-* API:", attrInput.getAttribute("data-demo") ?? "(missing)");
});

// 3 -- Modern modification API
addBtn.addEventListener("click", () => {
  list.insertAdjacentHTML("beforeend", "<li>via insertAdjacentHTML</li>");
  const li = document.createElement("li");
  li.textContent = "via createElement/append";
  list.append(li); // also: prepend, before, after, replaceWith
});
clearBtn.addEventListener("click", () => {
  list.innerHTML = "<li>one</li>"; // nukes & reparses everything
});

// 4 -- innerHTML executes markup (XSS!); textContent never does
xssBtn.addEventListener("click", () => {
  const userInput = `<img src=x onerror="this.replaceWith('XSS ran!')">`;
  xssHtml.innerHTML = "innerHTML: " + userInput; // the img error handler RUNS
  xssText.textContent = "textContent: " + userInput; // shown literally -- safe
});

// 5 -- Geometry: offset* (border box) vs client* (padding box) vs scroll*
geoBtn.addEventListener("click", () => {
  geoOut.textContent = "";
  log(geoOut, `offsetWidth x offsetHeight: ${sized.offsetWidth} x ${sized.offsetHeight} (content+padding+border+scrollbar)`);
  log(geoOut, `clientWidth x clientHeight: ${sized.clientWidth} x ${sized.clientHeight} (content+padding, minus scrollbar)`);
  log(geoOut, `scrollHeight: ${sized.scrollHeight} (full content) | scrollTop: ${sized.scrollTop}`);
  const r = sized.getBoundingClientRect(); // WINDOW coords -- change as you scroll the page
  log(geoOut, `getBoundingClientRect: top=${r.top.toFixed(1)} left=${r.left.toFixed(1)} (viewport-relative)`);
  log(geoOut, `page coords: top=${(r.top + window.pageYOffset).toFixed(1)} (add scroll for document-relative)`);
  sized.scrollTop += 20; // scrollTop is WRITABLE -- scroll programmatically
  log(geoOut, "scrolled the box by 20px; click again to see scrollTop change");
  sized.classList.toggle("highlight");
  // CSS width via getComputedStyle may differ from clientWidth (box-sizing!):
  log(geoOut, "getComputedStyle width:", getComputedStyle(sized).width);
});

export {};
