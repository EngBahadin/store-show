/**
 * Asset pipeline. Run with `npm run prep:assets` after dropping new photos
 * into public/products (any jpg/png/webp/avif).
 *
 *  - products : re-encoded to .webp, long edge capped at 1600px
 *  - brand    : white-on-black JPG logos -> transparent PNGs (white + black ink)
 *  - output   : src/data/blur.json, a slug -> base64 LQIP map used by <Shoe />
 *
 * Originals are left untouched so this is always safe to re-run.
 */
import sharp from "sharp";
import { readdir, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");
const PRODUCTS = path.join(ROOT, "public/products");
const BRAND = path.join(ROOT, "public/brand");
const SOURCE = /\.(jpe?g|png|avif)$/i;

/** White-on-black artwork -> RGBA where alpha is the source luminance. */
async function inkFromLuminance(src, out, size, ink) {
  const { data, info } = await sharp(src)
    .resize(size, size, { fit: "inside" })
    .greyscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // The source is a JPEG, so its "black" carries compression noise up to ~100.
  // A levels curve pins that to fully clear while keeping edge antialiasing.
  const LO = 96, HI = 200;
  const alpha = new Uint8Array(data.length);
  for (let i = 0; i < data.length; i++) {
    const v = ((data[i] - LO) / (HI - LO)) * 255;
    alpha[i] = v <= 0 ? 0 : v >= 255 ? 255 : Math.round(v);
  }

  const rgba = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < alpha.length; i++) {
    rgba[i * 4] = ink;
    rgba[i * 4 + 1] = ink;
    rgba[i * 4 + 2] = ink;
    rgba[i * 4 + 3] = alpha[i]; // white artwork stays opaque, black goes clear
  }

  // Crop the empty margin: sharp's trim keys off RGB, which is uniform here,
  // so derive the bounding box from the alpha channel directly.
  let top = info.height, left = info.width, right = -1, bottom = -1;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      if (alpha[y * info.width + x] < 8) continue;
      if (y < top) top = y;
      if (y > bottom) bottom = y;
      if (x < left) left = x;
      if (x > right) right = x;
    }
  }

  await sharp(rgba, { raw: { width: info.width, height: info.height, channels: 4 } })
    .extract({ left, top, width: right - left + 1, height: bottom - top + 1 })
    .png({ compressionLevel: 9 })
    .toFile(out);
  return `${right - left + 1}x${bottom - top + 1}`;
}

async function main() {
  await mkdir(path.join(ROOT, "src/data"), { recursive: true });

  // --- brand marks -------------------------------------------------------
  for (const [file, name, size] of [
    ["raven-wordmark-src.jpg", "raven-wordmark", 1024],
    ["raven-mark-src.jpg", "raven-mark", 512],
  ]) {
    for (const [suffix, ink] of [["white", 255], ["black", 0]]) {
      const out = path.join(BRAND, `${name}-${suffix}.png`);
      await inkFromLuminance(path.join(BRAND, file), out, size, ink);
      console.log(`brand    ${name}-${suffix}.png`);
    }
  }

  // favicon: white mark on the brand black
  await sharp({
    create: { width: 512, height: 512, channels: 4, background: "#0a0a0a" },
  })
    .composite([
      {
        input: await sharp(path.join(BRAND, "raven-mark-white.png"))
          .resize(340, 340, { fit: "inside" })
          .toBuffer(),
        gravity: "center",
      },
    ])
    .png()
    .toFile(path.join(ROOT, "public/icon.png"));
  console.log("brand    icon.png");

  // --- product photos ----------------------------------------------------
  const blur = {};
  for (const file of await readdir(PRODUCTS)) {
    if (!SOURCE.test(file)) continue;
    const slug = file.replace(SOURCE, "");
    const src = path.join(PRODUCTS, file);

    await sharp(src)
      .resize(1600, 1600, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toFile(path.join(PRODUCTS, `${slug}.webp`));

    const lqip = await sharp(src).resize(16).webp({ quality: 30 }).toBuffer();
    blur[slug] = `data:image/webp;base64,${lqip.toString("base64")}`;
    console.log(`product  ${slug}.webp`);
  }

  await writeFile(
    path.join(ROOT, "src/data/blur.json"),
    JSON.stringify(blur, null, 2) + "\n",
  );
  console.log(`\nwrote src/data/blur.json (${Object.keys(blur).length} entries)`);
}

main();
