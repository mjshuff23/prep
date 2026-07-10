const byId = (id, ctor) => {
  const el = document.getElementById(id);
  if (!(el instanceof ctor)) throw new Error(`#${id} is not ${ctor.name}`);
  return el;
};

const cssOut = byId("cssOut", HTMLOutputElement);
const rafOut = byId("rafOut", HTMLOutputElement);
const log = (el, line) => {
  el.textContent += line + "\n";
  el.scrollTop = el.scrollHeight;
};

const box = byId("box", HTMLDivElement);
document.querySelectorAll("[data-ease]").forEach((button) => {
  if (!(button instanceof HTMLButtonElement)) return;
  button.addEventListener("click", () => {
    const easing = button.dataset.ease ?? "ease";
    box.style.setProperty("--ease", easing);
    log(cssOut, `transition-timing-function = ${easing}`);
  });
});

byId("toggleBox", HTMLButtonElement).addEventListener("click", () => {
  box.classList.toggle("moved");
  log(cssOut, "class changed; CSS owns the interpolation");
});

box.addEventListener("transitionend", (event) => {
  log(cssOut, `transitionend for ${event.propertyName}`);
});

const ball = byId("ball", HTMLDivElement);
let rafId = 0;

const easings = {
  linear: (t) => t,
  easeOut: (t) => 1 - Math.pow(1 - t, 3),
};

function animateBall(easeName) {
  cancelAnimationFrame(rafId);
  const ease = easings[easeName];
  const start = performance.now();
  const duration = 900;
  const distance = 300;
  log(rafOut, `start ${easeName}; position is time-based`);

  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = ease(progress);
    ball.style.transform = `translateX(${Math.round(eased * distance)}px)`;
    if (progress < 1) {
      rafId = requestAnimationFrame(frame);
    } else {
      log(rafOut, `done in ${Math.round(now - start)}ms`);
    }
  }

  rafId = requestAnimationFrame(frame);
}

byId("runLinear", HTMLButtonElement).addEventListener("click", () => animateBall("linear"));
byId("runEaseOut", HTMLButtonElement).addEventListener("click", () => animateBall("easeOut"));
byId("cancelAnimation", HTMLButtonElement).addEventListener("click", () => {
  cancelAnimationFrame(rafId);
  log(rafOut, "canceled current rAF loop");
});
