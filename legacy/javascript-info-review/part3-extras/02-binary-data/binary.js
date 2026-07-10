// ArrayBuffer, typed arrays, TextEncoder/Decoder, Blob — javascript.info 2.1–2.4
// Run: node binary.js

// ── ArrayBuffer: raw fixed-length bytes. You can't read it directly ──
const buffer = new ArrayBuffer(16); // 16 bytes, zeroed
console.log(buffer.byteLength); // 16
// buffer[0] — undefined; an ArrayBuffer is NOT an array. You need a VIEW:

// ── TypedArray views: same bytes, different glasses ──
const u8 = new Uint8Array(buffer); // 16 elements of 1 byte
const u32 = new Uint32Array(buffer); // 4 elements of 4 bytes — SAME memory
u32[0] = 0x01020304;
console.log([...u8.slice(0, 4)]); // [ 4, 3, 2, 1 ] — little-endian revealed!
u8[0] = 255;
console.log(u32[0].toString(16)); // 10203ff — writes through one view show in the other

// ── The type zoo & overflow behavior ──
const i8 = new Int8Array([256, 257, -129]);
console.log([...i8]); // [ 0, 1, 127 ] — wraps modulo 2^8 (top bits discarded)
const clamped = new Uint8ClampedArray([300, -20, 128.6]);
console.log([...clamped]); // [ 255, 0, 129 ] — clamps + rounds (made for image data)
console.log(new Float64Array([0.1, 0.2]).length, Float64Array.BYTES_PER_ELEMENT); // 2 8

// ── Creating: from length, array, another view, or a buffer slice ──
console.log([...new Uint16Array([1, 1000])]); // [ 1, 1000 ]
const offsetView = new Uint8Array(buffer, 2, 4); // byteOffset 2, length 4 — a WINDOW
console.log(offsetView.byteOffset, offsetView.length); // 2 4

// TypedArrays have map/filter/slice/etc (return typed arrays), plus set/subarray:
const src = new Uint8Array([10, 20, 30, 40]);
const dst = new Uint8Array(8);
dst.set(src, 2); // copy in at offset 2
console.log([...dst]); // [ 0, 0, 10, 20, 30, 40, 0, 0 ]
const sub = src.subarray(1, 3); // NO copy — a view on the same buffer!
sub[0] = 99;
console.log(src[1]); // 99 — subarray aliases; slice() would have copied

// ── DataView: explicit-endianness, mixed-type access ──
const dv = new DataView(new ArrayBuffer(8));
dv.setUint16(0, 0x0102); // big-endian by default
console.log(dv.getUint8(0), dv.getUint8(1)); // 1 2
dv.setUint16(2, 0x0102, true); // little-endian flag
console.log(dv.getUint8(2), dv.getUint8(3)); // 2 1
// DataView = parsing binary file formats / network protocols with fixed layouts.

// ── TextEncoder / TextDecoder: strings ↔ bytes (UTF-8) ──
const bytes = new TextEncoder().encode("Héllo 𝒳"); // string → Uint8Array (always UTF-8)
console.log(bytes.length, "Héllo 𝒳".length); // 11 8 — bytes ≠ UTF-16 code units!
console.log(new TextDecoder().decode(bytes)); // Héllo 𝒳
console.log(new TextDecoder("utf-8", { fatal: true }) instanceof TextDecoder); // true
// fatal:true throws on malformed input instead of emitting U+FFFD �.

// ── Blob: immutable [type + byte chunks] — the WEB-world binary container ──
const blob = new Blob(["<html>…</html>"], { type: "text/html" });
console.log(blob.size, blob.type); // 16 text/html — size in UTF-8 BYTES: "…" is 3 bytes
console.log(await blob.text()); // <html>…</html>
const ab = await blob.arrayBuffer(); // Blob → ArrayBuffer when you need bytes
console.log(new Uint8Array(ab)[0] === "<".charCodeAt(0)); // true
const sliced = blob.slice(1, 5); // Blobs slice cheaply (by reference)
console.log(await sliced.text()); // html

// In browsers: URL.createObjectURL(blob) → "blob:..." link for download/display
// (and revokeObjectURL to release the mapping); FileReader is the legacy
// callback API — blob.text()/arrayBuffer()/stream() replace it.
// File = Blob + name + lastModified:
const file = new File(["content"], "notes.txt", { type: "text/plain" });
console.log(file.name, file.size, file.type); // notes.txt 7 text/plain

// ── base64 round-trip (Node idiom; browsers use FileReader.readAsDataURL/atob) ──
const b64 = Buffer.from(await blob.arrayBuffer()).toString("base64");
console.log(b64.slice(0, 8), Buffer.from(b64, "base64").toString().slice(0, 6)); // PGh0bWw+ <html>
// (ES2026 direction: Uint8Array.fromBase64 / toBase64 — check availability.)
