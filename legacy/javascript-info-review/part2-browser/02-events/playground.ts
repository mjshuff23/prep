interface LoginDetail {
  name: string;
}

function byId<T extends HTMLElement>(id: string, ctor: new () => T): T {
  const el = document.getElementById(id);
  if (!(el instanceof ctor)) throw new Error(`#${id} is not ${ctor.name}`);
  return el;
}

function log(el: HTMLElement, ...args: unknown[]): void {
  el.textContent += `${args.join(" ")}\n`;
  el.scrollTop = el.scrollHeight;
}

const phaseOut = byId("phaseOut", HTMLOutputElement);
const stopProp = byId("stopProp", HTMLInputElement);
const menu = byId("menu", HTMLDivElement);
const delegateOut = byId("delegateOut", HTMLOutputElement);
const link = byId("link", HTMLAnchorElement);
const allowDefault = byId("allowDefault", HTMLInputElement);
const defaultOut = byId("defaultOut", HTMLOutputElement);
const fireBtn = byId("fireBtn", HTMLButtonElement);
const customOut = byId("customOut", HTMLOutputElement);

// 1 -- Both phases on all three boxes: capture runs root->target, bubble target->root
for (const id of ["outer", "middle", "inner"]) {
  const el = byId(id, HTMLDivElement);
  el.addEventListener("click", (event) => {
    const target = event.target instanceof Element ? event.target.id : "(unknown)";
    const current = event.currentTarget instanceof Element ? event.currentTarget.id : "(unknown)";
    log(phaseOut, `capturing: ${id} (target=${target}, currentTarget=${current})`);
  }, { capture: true }); // capture listeners are rare but exist

  el.addEventListener("click", (event) => {
    log(phaseOut, `bubbling:  ${id}`);
    if (id === "middle" && stopProp.checked) {
      event.stopPropagation(); // outer's bubble listener won't run
      log(phaseOut, "  stopped at middle");
    }
  });
}
// Expected click on inner: capturing outer->middle->inner, then bubbling inner->middle->outer.

// 2 -- Delegation: one listener on the container, closest() finds the real target
menu.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;
  const btn = event.target.closest("button[data-action]");
  if (!(btn instanceof HTMLButtonElement) || !menu.contains(btn)) return;
  log(delegateOut, `action: ${btn.dataset.action ?? "(missing)"}`);
  // New buttons added later Just Work -- no listener wiring:
  if (btn.dataset.action === "save") {
    const extra = document.createElement("button");
    extra.dataset.action = `dynamic-${Date.now() % 100}`;
    extra.textContent = extra.dataset.action;
    menu.append(extra);
  }
});

// 3 -- preventDefault: the browser's built-in behavior is optional
link.addEventListener("click", (event) => {
  if (!allowDefault.checked) {
    event.preventDefault(); // stop navigation; propagation continues regardless!
    log(defaultOut, "navigation prevented (e.defaultPrevented =", `${event.defaultPrevented})`);
  } else {
    log(defaultOut, "navigating away...");
  }
});
// passive:true tells the browser you WON'T preventDefault (smooth scroll on touch/wheel):
document.addEventListener("wheel", () => {}, { passive: true });

// 4 -- CustomEvent: your own event type + detail payload, through the same pipeline
document.addEventListener("user:login", (event) => {
  const login = event as CustomEvent<LoginDetail>;
  log(customOut, `caught user:login for "${login.detail.name}" (bubbled to document)`);
});
fireBtn.addEventListener("user:login", () => {
  log(customOut, "also seen on the button itself");
});
fireBtn.addEventListener("click", () => {
  const ok = fireBtn.dispatchEvent(new CustomEvent<LoginDetail>("user:login", {
    bubbles: true, // default is false -- non-bubbling customs are common bug #1
    cancelable: true, // allows preventDefault by listeners
    detail: { name: "Ann" }, // the payload convention
  }));
  log(customOut, "dispatchEvent returned", ok, "(false would mean a listener called preventDefault)");
  // Note: dispatchEvent runs listeners SYNCHRONOUSLY, unlike real user events.
});

export {};
