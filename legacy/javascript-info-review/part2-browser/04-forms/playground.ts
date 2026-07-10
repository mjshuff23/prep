function byId<T extends HTMLElement>(id: string, ctor: new () => T): T {
  const el = document.getElementById(id);
  if (!(el instanceof ctor)) throw new Error(`#${id} is not ${ctor.name}`);
  return el;
}

function namedElement<T extends Element>(
  form: HTMLFormElement,
  name: string,
  ctor: new () => T,
): T {
  const el = form.elements.namedItem(name);
  if (!(el instanceof ctor)) throw new Error(`${name} is not ${ctor.name}`);
  return el;
}

function log(el: HTMLElement, ...args: unknown[]): void {
  el.textContent += `${args.join(" ")}\n`;
  el.scrollTop = el.scrollHeight;
}

const navBtn = byId("navBtn", HTMLButtonElement);
const navOut = byId("navOut", HTMLOutputElement);
const focusForm = byId("focusForm", HTMLFormElement);
const focusOut = byId("focusOut", HTMLOutputElement);
const inputEv = byId("inputEv", HTMLInputElement);
const changeEv = byId("changeEv", HTMLInputElement);
const ioOut = byId("ioOut", HTMLOutputElement);
const loginForm = byId("loginForm", HTMLFormElement);
const submitOut = byId("submitOut", HTMLOutputElement);

// 1 -- document.forms.name / form.elements.name -- the classic navigation
navBtn.addEventListener("click", () => {
  navOut.textContent = "";
  const form = document.forms.namedItem("order");
  if (!form) throw new Error("order form is missing");
  const user = namedElement(form, "user", HTMLInputElement);
  const size = namedElement(form, "size", HTMLSelectElement);
  const gift = namedElement(form, "gift", HTMLInputElement);
  const pay = form.elements.namedItem("pay");
  if (!(pay instanceof RadioNodeList)) throw new Error("pay radio group is missing");

  log(navOut, "user:", user.value);
  log(navOut, "size:", size.value, "| selectedIndex:", size.selectedIndex);
  log(navOut, "gift checked:", gift.checked); // checkboxes: .checked, not .value!
  log(navOut, "pay (RadioNodeList.value):", pay.value); // radios group into one list
  log(navOut, "element.form backreference:", user.form === form);
  // Bulk extraction -- FormData sees only named, enabled, checked-appropriate fields:
  log(navOut, "FormData:", JSON.stringify(Object.fromEntries(new FormData(form))));
});

// 2 -- focus/blur don't bubble; focusin/focusout DO -> delegation
function labelForTarget(target: EventTarget | null): string {
  if (target instanceof HTMLInputElement) return target.name;
  if (target instanceof HTMLElement) return target.tagName.toLowerCase();
  return "(unknown)";
}
focusForm.addEventListener("focusin", (event) => {
  log(focusOut, "focusin ->", labelForTarget(event.target));
});
focusForm.addEventListener("focusout", (event) => {
  log(focusOut, "focusout <-", labelForTarget(event.target));
});
// tabindex=0 makes any element keyboard-focusable; -1 = script-focusable only.
// el.focus({preventScroll:true}), document.activeElement = who has focus now.

// 3 -- input: every value change, immediately (typing, paste, drop).
// change: on COMMIT -- blur for text fields, immediately for select/checkbox.
inputEv.addEventListener("input", () => log(ioOut, "input:", inputEv.value));
changeEv.addEventListener("change", () => log(ioOut, "change (on blur):", changeEv.value));
// Note: input is NOT cancelable -- it fires after the fact; intercept keydown/beforeinput instead.

// 4 -- submit: fires on button click AND Enter; preventDefault stops navigation
loginForm.addEventListener("submit", (event) => {
  event.preventDefault(); // SPA-style handling
  const data = new FormData(loginForm); // name -> value, ready for fetch body
  const email = data.get("email");
  // Constraint Validation API -- the built-in validators, scriptable:
  if (!loginForm.checkValidity()) {
    log(submitOut, "invalid:", [...loginForm.elements]
      .filter((el): el is HTMLInputElement => el instanceof HTMLInputElement && el.willValidate && !el.validity.valid)
      .map((el) => `${el.name}(${el.validationMessage})`).join("; "));
    return;
  }
  log(submitOut, `would fetch("/login", {method:"POST", body: FormData}) for ${email}`);
  // form.submit() -- programmatic submit, SKIPS the submit event & validation entirely.
});

export {};
