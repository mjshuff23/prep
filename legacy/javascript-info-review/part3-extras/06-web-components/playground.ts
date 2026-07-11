interface CardActionDetail {
  name: string | null;
}

function byId<T extends HTMLElement>(id: string, ctor: new () => T): T {
  const el = document.getElementById(id);
  if (!(el instanceof ctor)) throw new Error(`#${id} is not ${ctor.name}`);
  return el;
}

const componentOut = byId("componentOut", HTMLOutputElement);
const host = byId("componentHost", HTMLDivElement);
const template = byId("cardTemplate", HTMLTemplateElement);
const addCard = byId("addCard", HTMLButtonElement);
const renameCard = byId("renameCard", HTMLButtonElement);
const removeCard = byId("removeCard", HTMLButtonElement);

function log(line: string): void {
  componentOut.textContent += `${line}\n`;
  componentOut.scrollTop = componentOut.scrollHeight;
}

class ReviewCard extends HTMLElement {
  static observedAttributes = ["name"];

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.append(template.content.cloneNode(true));
    const shadowButton = shadow.getElementById("shadowButton");
    if (!(shadowButton instanceof HTMLButtonElement)) throw new Error("shadow button is missing");
    shadowButton.addEventListener("click", () => {
      this.dispatchEvent(new CustomEvent<CardActionDetail>("card-action", {
        bubbles: true,
        composed: true,
        detail: { name: this.getAttribute("name") },
      }));
    });
  }

  connectedCallback(): void {
    log(`<review-card name="${this.getAttribute("name")}"> connected`);
    this.render();
  }

  disconnectedCallback(): void {
    log(`<review-card name="${this.getAttribute("name")}"> disconnected`);
  }

  attributeChangedCallback(name: string, oldValue: string | null, newValue: string | null): void {
    log(`attributeChangedCallback: ${name} ${oldValue} -> ${newValue}`);
    this.render();
  }

  render(): void {
    const nameOut = this.shadowRoot?.getElementById("nameOut");
    if (nameOut) nameOut.textContent = this.getAttribute("name") ?? "(missing)";
  }
}

if (!customElements.get("review-card")) {
  customElements.define("review-card", ReviewCard);
}

host.addEventListener("card-action", (event) => {
  const cardEvent = event as CustomEvent<CardActionDetail>;
  const path = cardEvent.composedPath();
  const first = path[0] instanceof Element ? path[0].tagName.toLowerCase() : String(path[0]);
  const target = cardEvent.target instanceof Element ? cardEvent.target.tagName.toLowerCase() : String(cardEvent.target);
  log(`card-action detail=${JSON.stringify(cardEvent.detail)} target=${target} path[0]=${first}`);
});

addCard.addEventListener("click", () => {
  if (host.querySelector("review-card")) {
    log("component already exists");
    return;
  }
  const card = document.createElement("review-card");
  card.setAttribute("name", "Ada");
  card.innerHTML = `
    <span slot="title">Slotted title</span>
    <p>This paragraph lives in light DOM and is projected through a slot.</p>
  `;
  host.append(card);
});

renameCard.addEventListener("click", () => {
  const card = host.querySelector("review-card");
  if (!card) {
    log("add the component first");
    return;
  }
  const next = card.getAttribute("name") === "Ada" ? "Grace" : "Ada";
  card.setAttribute("name", next);
});

removeCard.addEventListener("click", () => {
  const card = host.querySelector("review-card");
  if (!card) {
    log("nothing to remove");
    return;
  }
  card.remove();
});

export {};
