# Part 3.2 — Binary data, files

Files: `binary.js` · `binary.ts`

## The layer cake

```
ArrayBuffer          raw bytes, fixed length, unreadable directly
  ├─ TypedArray      Uint8Array, Int32Array, Float64Array... — array-like VIEWS
  ├─ DataView        explicit-offset, explicit-endianness accessor
Blob                 immutable {type, chunks} — the Web's binary container
  └─ File            Blob + name + lastModified
```

The key idea: **an `ArrayBuffer` is memory; views are interpretations of it.** Several
views can share one buffer — writing `0x01020304` through a `Uint32Array` and reading
`[4,3,2,1]` through a `Uint8Array` is how you discover your CPU is little-endian.
`subarray()` aliases (no copy); `slice()` copies. This aliasing is a feature (zero-copy
parsing) and a bug source (mutating what you thought was independent).

Overflow behavior differs by family: plain integer arrays **wrap** modulo 2ⁿ
(`Int8Array` gets `256 → 0`), `Uint8ClampedArray` **clamps and rounds** (built for
canvas pixels). `DataView` is for protocol/file-format parsing where each field has an
offset, size, and *explicit* endianness — typed arrays always use the platform's.

## Strings ↔ bytes

`TextEncoder.encode(str)` → UTF-8 `Uint8Array`; `TextDecoder.decode(bytes)` back.
Remember the three different lengths of "Héllo 𝒳": UTF-16 code units (`.length`),
code points (`[...s].length`), and UTF-8 **bytes** (`encode(s).length`) — all
different. `TextDecoder` with `{fatal: true}` throws on malformed input instead of
silently emitting `�`.

## Blob & File

A `Blob` is immutable and cheap to slice (by reference). Modern reading is
promise-based — `blob.text()`, `blob.arrayBuffer()`, `blob.stream()` — making
`FileReader` (the callback API) legacy except for `readAsDataURL`-style progress needs.
In browsers, `URL.createObjectURL(blob)` mints a `blob:` URL for downloads/images
(revoke it when done, or the blob is pinned in memory); base64 data-URLs do the same
job with +33% size and full memory cost. File inputs and drag-drop hand you `File`
objects; from Node 20+, `Blob`/`File` exist natively.

TS lens: accept `BufferSource` (`ArrayBuffer | ArrayBufferView`) in binary APIs like
the platform does; typed arrays have no `push` (fixed length — the types enforce it);
element reads under `noUncheckedIndexedAccess` are `number | undefined`; brand typed
arrays that carry semantic layout (RGBA, audio frames).

## Predict the output

```js
// 1
const buf = new ArrayBuffer(4);
const a = new Uint8Array(buf), b = new Uint8Array(buf);
a[0] = 42;
console.log(b[0], a === b);

// 2
console.log([...new Int8Array([127, 128, 129])]);

// 3
const x = new Uint8Array([1, 2, 3, 4]);
const y = x.subarray(1, 3), z = x.slice(1, 3);
x[1] = 99;
console.log(y[0], z[0]);

// 4
console.log("𝒳".length, new TextEncoder().encode("𝒳").length);
```

<details>
<summary>Answers</summary>

1. `42 false` — two different view objects over the *same* memory.
2. `[ 127, -128, -127 ]` — signed 8-bit wraps: 128 overflows to −128.
3. `99 2` — `subarray` aliases the buffer, `slice` copied before the write.
4. `2 4` — one code point = two UTF-16 units = four UTF-8 bytes.

</details>
