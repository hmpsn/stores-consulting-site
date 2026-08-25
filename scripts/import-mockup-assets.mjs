import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = '/Users/joshuahampson/Downloads/tSCG_Website_Mockup (15).html';

async function main() {
  const html = await readFile(SOURCE, 'utf8');
  const $ = cheerio.load(html);
  const assets = [];
  const seen = new Set();
  const directory = join(ROOT, 'public/assets/mockup/clients');
  await mkdir(directory, { recursive: true });

  for (const image of $('img[src^="data:image/"]').toArray()) {
    const element = $(image);
    const source = element.attr('src');
    const slot = element.closest('[data-logo-slot]').attr('data-logo-slot') || element.attr('alt') || 'client';
    const baseName = slot.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (!source || !baseName || seen.has(baseName)) continue;
    seen.add(baseName);
    const match = source.match(/^data:image\/([^;]+);base64,(.+)$/s);
    if (!match) continue;
    const input = Buffer.from(match[2], 'base64');
    const outputPath = join(directory, `${baseName}.webp`);
    const metadata = await sharp(input).metadata();
    await sharp(input).webp({ quality: 88, effort: 5 }).toFile(outputPath);
    const outputMetadata = await sharp(outputPath).metadata();
    assets.push({
      name: element.attr('alt') || slot,
      slug: baseName,
      path: `/assets/mockup/clients/${baseName}.webp`,
      width: outputMetadata.width,
      height: outputMetadata.height,
      sourceWidth: metadata.width,
      sourceHeight: metadata.height,
    });
  }

  await writeFile(join(ROOT, 'src/data/mockup-client-logos.json'), `${JSON.stringify(assets, null, 2)}\n`);
  console.log(`Imported and optimized ${assets.length} mockup client logos.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
