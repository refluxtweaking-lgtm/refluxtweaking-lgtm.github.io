// Build the website tab icon (web-icon.ico) from the chosen source art.
// Crops the wide source to a centered square (so the wordmark stays large),
// then encodes a multi-resolution PNG-in-ICO. Leaves favicon.ico untouched.
import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const SRC = process.argv[2] ?? "web-icon-source.png";
const SIZES = [16, 32, 48, 64, 128, 256];

async function squareSourceBuffer() {
  const meta = await sharp(SRC).metadata();
  const side = Math.min(meta.width, meta.height);
  const left = Math.floor((meta.width - side) / 2);
  const top = Math.floor((meta.height - side) / 2);
  return sharp(SRC).extract({ left, top, width: side, height: side }).png().toBuffer();
}

async function sizedPng(squareBuf, size) {
  return sharp(squareBuf).resize(size, size, { fit: "fill" }).png().toBuffer();
}

function buildIco(entries) {
  const count = entries.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(count, 4);

  const dir = [];
  const images = [];
  let offset = 6 + count * 16;

  for (const { size, buffer } of entries) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(buffer.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += buffer.length;
    dir.push(e);
    images.push(buffer);
  }

  return Buffer.concat([header, ...dir, ...images]);
}

const squareBuf = await squareSourceBuffer();
const entries = [];
for (const size of SIZES) {
  entries.push({ size, buffer: await sizedPng(squareBuf, size) });
}

await writeFile("public/web-icon.ico", buildIco(entries));
await writeFile("public/web-icon.png", await sizedPng(squareBuf, 512));

console.log("Wrote public/web-icon.ico and public/web-icon.png");
