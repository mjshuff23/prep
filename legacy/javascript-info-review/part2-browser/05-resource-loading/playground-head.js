// Runs FIRST (blocking, in head): the DOM below doesn't exist yet.
window.timeline = [];
const mark = (what) => window.timeline.push(`${performance.now().toFixed(0)}ms -- ${what}`);
mark("head script ran (document.body is " + document.body + ")");

document.addEventListener("DOMContentLoaded", () => {
  mark("DOMContentLoaded (DOM tree complete; images/styles may still load)");
});
window.addEventListener("load", () => {
  mark("window load (EVERYTHING loaded: images, styles, iframes)");
  const timelineOut = document.getElementById("timelineOut");
  if (timelineOut) timelineOut.textContent = window.timeline.join("\n");
});
// beforeunload: ask before leaving (must preventDefault; custom text is ignored):
// window.addEventListener("beforeunload", (e) => e.preventDefault());
// unload/pagehide: last-gasp analytics -- use navigator.sendBeacon(url, data),
// regular fetch may be killed mid-flight.
