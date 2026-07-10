function byId<T extends HTMLElement>(id: string, ctor: new () => T): T {
  const el = document.getElementById(id);
  if (!(el instanceof ctor)) throw new Error(`#${id} is not ${ctor.name}`);
  return el;
}

const popupOut = byId("popupOut", HTMLOutputElement);
const frameOut = byId("frameOut", HTMLOutputElement);
const openPopup = byId("openPopup", HTMLButtonElement);
const sendPopup = byId("sendPopup", HTMLButtonElement);
const checkPopup = byId("checkPopup", HTMLButtonElement);
const fakeOverlay = byId("fakeOverlay", HTMLDivElement);

function log(el: HTMLElement, line: string): void {
  el.textContent += `${line}\n`;
  el.scrollTop = el.scrollHeight;
}

let child: Window | null = null;

window.addEventListener("message", (event) => {
  // Demo uses "*" because about:blank/file demos can have awkward origins.
  // Production code should check event.origin and validate event.data.
  log(popupOut, `parent received from ${event.origin}: ${JSON.stringify(event.data)}`);
});

function writePopupDocument(target: Window): void {
  target.document.open();
  target.document.write(`<!doctype html>
    <html lang="en">
    <head><meta charset="utf-8"><title>Child popup</title></head>
    <body style="font-family:system-ui;margin:1.5rem">
      <h1>Child popup</h1>
      <button id="reply">postMessage to opener</button>
      <output id="out" style="display:block;background:#f6f6f6;padding:.5rem;margin-top:.5rem;white-space:pre-wrap"></output>
    </body>
    </html>`);
  target.document.close();
}

function wirePopup(target: Window): void {
  const out = target.document.getElementById("out");
  const reply = target.document.getElementById("reply");
  if (!out || !reply) throw new Error("popup markup failed to render");

  const write = (line: string): void => {
    out.textContent += `${line}\n`;
  };

  target.addEventListener("message", (event) => {
    write("child received: " + JSON.stringify(event.data));
  });

  reply.addEventListener("click", (event) => {
    const sourceWindow = event.view ?? target;
    const openerWindow = sourceWindow.opener as Window | null;
    openerWindow?.postMessage({ kind: "child-reply", at: Date.now() }, "*");
  });

  const openerWindow = target.opener as Window | null;
  openerWindow?.postMessage({ kind: "child-ready" }, "*");
}

openPopup.addEventListener("click", () => {
  child = window.open("", "jsInfoReviewPopup", "popup,width=430,height=310");
  if (!child) {
    log(popupOut, "popup blocked; allow popups for this page and try again");
    return;
  }

  writePopupDocument(child);
  wirePopup(child);
  child.focus();
  log(popupOut, "opened/reused popup named jsInfoReviewPopup");
});

sendPopup.addEventListener("click", () => {
  if (!child || child.closed) {
    log(popupOut, "open the popup first");
    return;
  }
  child.postMessage({ kind: "parent-message", text: "hello from parent" }, "*");
  log(popupOut, "parent sent message");
});

checkPopup.addEventListener("click", () => {
  log(popupOut, `popup.closed = ${child ? child.closed : "(no popup reference)"}`);
});

fakeOverlay.addEventListener("click", () => {
  log(frameOut, "overlay got the click; frame headers are the real defense");
});

export {};
