declare global {
  interface Window {
    dynamicRan?: boolean;
    timeline: string[];
  }
}

function byId<T extends HTMLElement>(id: string, ctor: new () => T): T {
  const el = document.getElementById(id);
  if (!(el instanceof ctor)) throw new Error(`#${id} is not ${ctor.name}`);
  return el;
}

function log(el: HTMLElement, ...args: unknown[]): void {
  el.textContent += `${args.join(" ")}\n`;
}

const loadOk = byId("loadOk", HTMLButtonElement);
const loadBad = byId("loadBad", HTMLButtonElement);
const scriptOut = byId("scriptOut", HTMLOutputElement);

// 2 -- The dynamic-script pattern (how loaders/bundlers bootstrap):
function loadScript(src: string): Promise<HTMLScriptElement> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    // Dynamic scripts behave ASYNC by default; set script.async = false to queue in order.
    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error(`failed to load ${src}`)); // no HTTP details -- just failed
    document.head.append(script);
  });
}

loadOk.addEventListener("click", async () => {
  try {
    await loadScript("data:text/javascript,window.dynamicRan=true");
    log(scriptOut, "loaded dynamicRan =", window.dynamicRan);
  } catch (error) {
    log(scriptOut, error instanceof Error ? error.message : String(error));
  }
});

loadBad.addEventListener("click", async () => {
  try {
    await loadScript("./definitely-missing.js");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log(scriptOut, "onerror", message);
    // For runtime errors INSIDE loaded scripts: window.onerror -- but cross-origin
    // scripts report only "Script error." unless crossorigin + CORS headers agree.
  }
});
// img.onload/onerror work the same; iframes fire load even on error pages.

export {};
