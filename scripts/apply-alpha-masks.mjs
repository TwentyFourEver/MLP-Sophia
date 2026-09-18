import { copyFile, unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const characterDir = path.join(projectRoot, 'public', 'assets', 'characters');

const pairs = [
  ['twilight-worried.png', 'twilight-neutral.png'],
  ['twilight-proud.png', 'twilight-neutral.png'],
  ['spike-startled.png', 'spike-neutral.png'],
  ['pinkie-sheepish.png', 'pinkie-neutral.png'],
  ['applejack-confident.png', 'applejack-neutral.png'],
  ['rarity-inspired.png', 'rarity-neutral.png'],
  ['fluttershy-worried.png', 'fluttershy-neutral.png'],
  ['rainbow-challenging.png', 'rainbow-neutral.png'],
];

for (const [colorName, maskName] of pairs) {
  const colorPath = path.join(characterDir, colorName);
  const maskPath = path.join(characterDir, maskName);
  const tempPath = `${colorPath}.masked.png`;
  const maskMetadata = await sharp(maskPath).metadata();

  if (!maskMetadata.width || !maskMetadata.height) {
    throw new Error(`No se pudo leer el tamaño de ${maskName}`);
  }

  const { data: color, info } = await sharp(colorPath)
    .resize(maskMetadata.width, maskMetadata.height, { fit: 'fill' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const original = await sharp(maskPath).ensureAlpha().raw().toBuffer();

  const pixelCount = original.length / 4;
  for (let pixel = 0; pixel < pixelCount; pixel += 1) {
    const offset = pixel * 4;
    const alpha = original[offset + 3];
    color[offset + 3] = alpha;

    // Generated edits sometimes bake a checkerboard into transparent pixels.
    // Reusing the original edge and glow colors keeps the silhouette clean.
    const red = color[offset];
    const green = color[offset + 1];
    const blue = color[offset + 2];
    const maximum = Math.max(red, green, blue);
    const minimum = Math.min(red, green, blue);
    const bakedChecker = maximum - minimum < 18 && maximum > 65 && maximum < 250;

    if (alpha < 245 || bakedChecker) {
      color[offset] = original[offset];
      color[offset + 1] = original[offset + 1];
      color[offset + 2] = original[offset + 2];
    }
  }

  await sharp(color, { raw: info }).png().toFile(tempPath);
  await copyFile(tempPath, colorPath);
  await unlink(tempPath);
  console.log(`Máscara aplicada: ${colorName}`);
}
