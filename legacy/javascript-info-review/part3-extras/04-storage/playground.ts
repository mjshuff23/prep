interface StoredNote {
  id?: number;
  text: string;
  createdAt: string;
}

function byId<T extends HTMLElement>(id: string, ctor: new () => T): T {
  const el = document.getElementById(id);
  if (!(el instanceof ctor)) throw new Error(`#${id} is not ${ctor.name}`);
  return el;
}

function log(el: HTMLElement, line: string): void {
  el.textContent += `${line}\n`;
  el.scrollTop = el.scrollHeight;
}

const cookieValue = byId("cookieValue", HTMLInputElement);
const setCookie = byId("setCookie", HTMLButtonElement);
const readCookie = byId("readCookie", HTMLButtonElement);
const clearCookie = byId("clearCookie", HTMLButtonElement);
const cookieOut = byId("cookieOut", HTMLOutputElement);
const storageValue = byId("storageValue", HTMLInputElement);
const writeStorage = byId("writeStorage", HTMLButtonElement);
const readStorage = byId("readStorage", HTMLButtonElement);
const openTwin = byId("openTwin", HTMLButtonElement);
const storageOut = byId("storageOut", HTMLOutputElement);
const noteText = byId("noteText", HTMLInputElement);
const addNote = byId("addNote", HTMLButtonElement);
const listNotes = byId("listNotes", HTMLButtonElement);
const clearNotes = byId("clearNotes", HTMLButtonElement);
const idbOut = byId("idbOut", HTMLOutputElement);

setCookie.addEventListener("click", () => {
  const value = encodeURIComponent(cookieValue.value);
  document.cookie = `reviewCookie=${value}; max-age=3600; SameSite=Lax`;
  log(cookieOut, "wrote one cookie assignment");
});

readCookie.addEventListener("click", () => {
  log(cookieOut, document.cookie || "(empty; cookies may require http://localhost)");
});

clearCookie.addEventListener("click", () => {
  document.cookie = "reviewCookie=; max-age=0; SameSite=Lax";
  log(cookieOut, "expired reviewCookie");
});

window.addEventListener("storage", (event) => {
  log(storageOut, `storage event from another tab: ${event.key} -> ${event.newValue}`);
});

writeStorage.addEventListener("click", () => {
  localStorage.setItem("js-info-review:local", storageValue.value);
  sessionStorage.setItem("js-info-review:session", storageValue.value);
  log(storageOut, "wrote localStorage and sessionStorage in this tab");
});

readStorage.addEventListener("click", () => {
  log(storageOut, `local: ${localStorage.getItem("js-info-review:local")}`);
  log(storageOut, `session: ${sessionStorage.getItem("js-info-review:session")}`);
});

openTwin.addEventListener("click", () => {
  window.open(location.href, "storageTwin");
  log(storageOut, "opened/reused a same-origin tab; write here and watch there");
});

const DB_NAME = "js-info-review-storage";
const STORE = "notes";

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id", autoIncrement: true });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function addIndexedNote(text: string): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).add({ text, createdAt: new Date().toISOString() } satisfies StoredNote);
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

async function listIndexedNotes(): Promise<StoredNote[]> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const request = tx.objectStore(STORE).getAll();
    request.onsuccess = () => resolve(request.result as StoredNote[]);
    request.onerror = () => reject(request.error);
    tx.oncomplete = () => db.close();
  });
}

async function clearIndexedNotes(): Promise<void> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).clear();
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

const errorMessage = (error: unknown): string => error instanceof Error ? error.message : String(error);

addNote.addEventListener("click", async () => {
  try {
    await addIndexedNote(noteText.value);
    log(idbOut, "note stored in IndexedDB");
  } catch (error) {
    log(idbOut, `IndexedDB error: ${errorMessage(error)}`);
  }
});

listNotes.addEventListener("click", async () => {
  try {
    const notes = await listIndexedNotes();
    log(idbOut, notes.length ? JSON.stringify(notes, null, 2) : "(no notes)");
  } catch (error) {
    log(idbOut, `IndexedDB error: ${errorMessage(error)}`);
  }
});

clearNotes.addEventListener("click", async () => {
  try {
    await clearIndexedNotes();
    log(idbOut, "notes cleared");
  } catch (error) {
    log(idbOut, `IndexedDB error: ${errorMessage(error)}`);
  }
});

export {};
