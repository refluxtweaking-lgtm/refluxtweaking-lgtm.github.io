// Build the Open Graph link-preview image (1200x630) from the black REFLUX
// TWEAKS art. Fits the source onto a black canvas so it looks right when the
// URL is shared on Discord, iMessage, X, etc.
import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const SRC = process.argv[2] ?? "og-source.png";
const W = 1200;
const H = 630;

const resized = await sharp(SRC)
  .resize(W, H, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 1 } })
  .flatten({ background: { r: 0, g: 0, b: 0 } })
  .png()
  .toBuffer();

await writeFile("public/og-image.png", resized);
console.log("Wrote public/og-image.png (1200x630)");
