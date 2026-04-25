/**
 * generate-display.js
 * Generates optimised display-size images from /works/ into /public/display/
 * These are used in the poster overlay and CAD drawing lightbox — fast to load,
 * still high quality enough to look great on screen.
 *
 * Usage: node scripts/generate-display.js  (auto-run via npm run dev/build)
 */

import sharp from 'sharp'
import { readdir, mkdir, stat } from 'node:fs/promises'
import { join, extname, relative, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT    = join(__dirname, '..')
const SRC_DIR = join(ROOT, 'works')
const OUT_DIR = join(ROOT, 'public', 'display')

const MAX_W   = 1400   // wide enough for any screen, small enough to load fast
const MAX_H   = 1800
const QUALITY = 85
const SUPPORTED = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.tiff'])

async function collectImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const full = join(dir, entry.name)
    if (entry.isDirectory()) files.push(...await collectImages(full))
    else if (SUPPORTED.has(extname(entry.name).toLowerCase())) files.push(full)
  }
  return files
}

async function processImage(srcPath) {
  const rel    = relative(SRC_DIR, srcPath)
  const outDir = dirname(join(OUT_DIR, rel))
  await mkdir(outDir, { recursive: true })

  const name   = basename(srcPath, extname(srcPath))
  const webpOut = join(outDir, `${name}.webp`)

  try {
    const [srcStat, outStat] = await Promise.all([stat(srcPath), stat(webpOut)])
    if (outStat.mtimeMs >= srcStat.mtimeMs) { console.log(`  skip  ${rel}`); return }
  } catch { /* doesn't exist yet */ }

  const pipeline = sharp(srcPath).resize(MAX_W, MAX_H, {
    fit: 'inside',
    withoutEnlargement: true,
  })

  await pipeline.webp({ quality: QUALITY }).toFile(webpOut)
  console.log(`  ✓  ${rel}`)
}

async function main() {
  console.log(`\nGenerating display images (${MAX_W}×${MAX_H}, q${QUALITY}, WebP)\n`)
  const images = await collectImages(SRC_DIR)
  if (!images.length) { console.log('No images found.'); return }
  await Promise.all(images.map(processImage))
  console.log(`\nDone — ${images.length} image(s) processed.\n`)
}

main().catch(err => { console.error(err); process.exit(1) })
