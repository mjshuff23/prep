const byId = (id, ctor) => {
  const el = document.getElementById(id);
  if (!(el instanceof ctor)) throw new Error(`#${id} is not ${ctor.name}`);
  return el;
};

const write = (el, line) => {
  el.textContent += line + "\n";
  el.scrollTop = el.scrollHeight;
};

const watched = byId("watched", HTMLDivElement);
const mutationOut = byId("mutationOut", HTMLOutputElement);
const addItem = byId("addItem", HTMLButtonElement);
const changeAttr = byId("changeAttr", HTMLButtonElement);
const editText = byId("editText", HTMLButtonElement);
const disconnectObserver = byId("disconnectObserver", HTMLButtonElement);
const editable = byId("editable", HTMLDivElement);
const rangeOut = byId("rangeOut", HTMLOutputElement);
const selectFirst = byId("selectFirst", HTMLButtonElement);
const inspectSelection = byId("inspectSelection", HTMLButtonElement);
const wrapSelection = byId("wrapSelection", HTMLButtonElement);
const clearSelection = byId("clearSelection", HTMLButtonElement);

// 1 -- MutationObserver callbacks run as microtasks after the current script
// finishes. One callback can contain several MutationRecord objects.
const observer = new MutationObserver((records) => {
  write(mutationOut, `observer callback: ${records.length} record(s)`);
  for (const record of records) {
    const target =
      record.target instanceof Element
        ? record.target.tagName.toLowerCase()
        : "text node";
    write(mutationOut, `- ${record.type} on ${target}`);
  }
});
observer.observe(watched, {
  childList: true,
  attributes: true,
  characterData: true,
  subtree: true,
  attributeOldValue: true,
  characterDataOldValue: true,
});

let itemCount = 0;
addItem.addEventListener("click", () => {
  const item = document.createElement("p");
  item.textContent = `Appended item ${++itemCount}`;
  watched.append(item);
  write(mutationOut, "sync: append() returned; observer has not run yet");
});
changeAttr.addEventListener("click", () => {
  const version = Number(watched.dataset.version ?? "0") + 1;
  watched.dataset.version = String(version);
  write(mutationOut, `sync: data-version is now ${version}`);
});
editText.addEventListener("click", () => {
  const text = watched.querySelector("p")?.firstChild;
  if (text) text.textContent = `Observed text edited at ${new Date().toLocaleTimeString()}`;
});
disconnectObserver.addEventListener("click", () => {
  observer.disconnect();
  write(mutationOut, "observer disconnected; future changes are silent");
});

// 2 -- Selection is the user-facing object; Range is the precise pair of DOM
// boundary points. Many editors keep their own model because DOM ranges are live.
function getCurrentRange() {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return null;
  return selection.getRangeAt(0);
}

selectFirst.addEventListener("click", () => {
  const walker = document.createTreeWalker(editable, NodeFilter.SHOW_TEXT);
  const firstText = walker.nextNode();
  if (!firstText) return;
  const text = firstText.textContent ?? "";
  const end = text.indexOf(".");
  const range = document.createRange();
  range.setStart(firstText, 0);
  range.setEnd(firstText, end === -1 ? text.length : end + 1);
  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
  write(rangeOut, "selected the first sentence programmatically");
});

inspectSelection.addEventListener("click", () => {
  const selection = window.getSelection();
  const range = getCurrentRange();
  if (!selection || !range) {
    write(rangeOut, "no active selection");
    return;
  }
  write(rangeOut, `text: "${selection.toString()}"`);
  write(rangeOut, `collapsed: ${selection.isCollapsed}`);
  write(rangeOut, `start: ${range.startContainer.nodeName} @ ${range.startOffset}`);
  write(rangeOut, `end: ${range.endContainer.nodeName} @ ${range.endOffset}`);
});

wrapSelection.addEventListener("click", () => {
  const range = getCurrentRange();
  if (!range || range.collapsed) {
    write(rangeOut, "select some text first");
    return;
  }
  const mark = document.createElement("mark");
  try {
    range.surroundContents(mark);
  } catch {
    // surroundContents throws if the range cuts across element boundaries.
    mark.append(range.extractContents());
    range.insertNode(mark);
  }
  window.getSelection()?.removeAllRanges();
  write(rangeOut, "wrapped selection in <mark>");
});

clearSelection.addEventListener("click", () => {
  window.getSelection()?.removeAllRanges();
  write(rangeOut, "selection cleared");
});
