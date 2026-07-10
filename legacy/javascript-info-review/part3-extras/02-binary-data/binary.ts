// Binary data — the TypeScript lens
// Run: npx tsx binary.ts

// ── The type hierarchy: ArrayBuffer / ArrayBufferView / TypedArray family ──
// Functions that accept "any binary" should take the union lib.d.ts uses:
function byteLength(data: ArrayBuffer | ArrayBufferView): number {
  return data.byteLength; // both have byteLength; views also have byteOffset
}
console.log(byteLength(new ArrayBuffer(4)), byteLength(new Float32Array(2))); // 4 8

// BufferSource = ArrayBuffer | ArrayBufferView — the param type Web APIs use
// (TextDecoder#decode, crypto.subtle.digest, WebSocket#send...).
const dec = new TextDecoder();
const src: BufferSource = new TextEncoder().encode("hi");
console.log(dec.decode(src)); // hi

// ── Uint8Array<ArrayBuffer> vs SharedArrayBuffer (TS 5.7+ generic buffers) ──
// Modern lib.d.ts parameterizes typed arrays by their backing buffer type,
// so a Uint8Array over SharedArrayBuffer can't flow where a plain one is required.
const plain: Uint8Array = new Uint8Array(4);
console.log(plain.buffer instanceof ArrayBuffer); // true

// ── Typed arrays are NOT arrays: no push, fixed length — the types tell you ──
const u8 = new Uint8Array([1, 2, 3]);
// u8.push(4); // TS error: push does not exist
const grown = new Uint8Array(u8.length + 1); // "growing" = allocate + copy
grown.set(u8);
grown[3] = 4;
console.log([...grown]); // [ 1, 2, 3, 4 ]

// ── Element types are all `number` — brands can distinguish semantics ──
type Rgba = Uint8ClampedArray & { readonly __brand: "rgba" };
const asRgba = (px: Uint8ClampedArray): Rgba => {
  if (px.length % 4 !== 0) throw new Error("RGBA needs 4 bytes per pixel");
  return px as Rgba;
};
function invert(px: Rgba): Rgba {
  for (let i = 0; i < px.length; i += 4) {
    px[i] = 255 - px[i]!;
    px[i + 1] = 255 - px[i + 1]!;
    px[i + 2] = 255 - px[i + 2]!; // alpha (i+3) untouched
  }
  return px;
}
console.log([...invert(asRgba(new Uint8ClampedArray([255, 0, 0, 255])))]); // [ 0, 255, 255, 255 ]

// ── Binary protocol parsing with DataView: types keep offsets honest-ish ──
interface Header {
  version: number;
  flags: number;
  length: number;
}
function parseHeader(buf: ArrayBuffer): Header {
  const dv = new DataView(buf);
  return {
    version: dv.getUint8(0),
    flags: dv.getUint8(1),
    length: dv.getUint32(2, /* littleEndian */ true),
  };
}
const packet = new ArrayBuffer(6);
const w = new DataView(packet);
w.setUint8(0, 2);
w.setUint8(1, 0b101);
w.setUint32(2, 1024, true);
console.log(parseHeader(packet)); // { version: 2, flags: 5, length: 1024 }

// ── Blob/File are typed in lib.dom; async readers return typed promises ──
const blob = new Blob(["data"], { type: "text/plain" });
const text: string = await blob.text();
const bytes: ArrayBuffer = await blob.arrayBuffer();
console.log(text, bytes.byteLength); // data 4
