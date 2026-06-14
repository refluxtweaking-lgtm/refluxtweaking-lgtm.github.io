// Build a square, multi-resolution favicon (.ico) for REFLUX TWEAKS from the
// wide source PNG. The wide art is centered onto a transparent square canvas so
// nothing is cropped, then encoded as PNG-in-ICO (supported by all modern
// browsers). Also writes src/app/icon.png so Next.js serves it on the tab.
import sharp from "sharp";
import { writeFile, mkdir } from "node:fs/promises";

const SRC = process.argv[2] ?? "website-icon-source.png";
const SIZES = [16, 32, 48, 64, 128, 256];

async function squarePngBuffer(size) {
  const meta = await sharp(SRC).metadata();
  const side = Math.max(meta.width, meta.height);

  // Place the source centered on a transparent square, then resize.
  const squared = await sharp({
    create: {
      width: side,
      height: side,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      {
        input: await sharp(SRC).toBuffer(),
        gravity: "center",
      },
    ])
    .png()
    .toBuffer();

  return sharp(squared)
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
}

function buildIco(pngBuffers) {
  const count = pngBuffers.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(count, 4);

  const entries = [];
  const images = [];
  let offset = 6 + count * 16;

  pngBuffers.forEach(({ size, buffer }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0); // width (0 = 256)
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
    entry.writeUInt8(0, 2); // color palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(buffer.length, 8); // size of image data
    entry.writeUInt32LE(offset, 12); // offset of image data
    offset += buffer.length;
    entries.push(entry);
    images.push(buffer);
  });

  return Buffer.concat([header, ...entries, ...images]);
}

const pngBuffers = [];
for (const size of SIZES) {
  pngBuffers.push({ size, buffer: await squarePngBuffer(size) });
}

const ico = buildIco(pngBuffers);

await writeFile("public/website.ico", ico);
await writeFile("public/favicon.ico", ico);

await mkdir("src/app", { recursive: true });
await writeFile("src/app/icon.png", await squarePngBuffer(256));
await writeFile("public/website-icon.png", await squarePngBuffer(512));

console.log("Wrote public/website.ico, public/favicon.ico, src/app/icon.png");
