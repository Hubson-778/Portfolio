/**
 * generate-thumbs.js
 * Generates optimised WebP thumbnails from /works/ into /public/thumbs/
 * Also keeps a fallback JPEG/PNG for browsers without WebP support.
 *
 * Usage:  npm run thumbs
 */

import sharp from 'sharp'
import { readdir, mkdir, stat } from 'node:fs/promises'
import { join, extname, relative, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT    = join(__dirname, '..')
const SRC_DIR = join(ROOT, 'works')
const OUT_DIR = join(ROOT, 'public', 'thumbs')

// Thumbnail: max 320px wide — enough for the grid, tiny file size
const THUMB_W   = 320
const THUMB_H   = 480
const QUALITY   = 82
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

  const name    = basename(srcPath, extname(srcPath))
  const webpOut = join(outDir, `${name}.webp`)

  // Skip if webp thumb is newer than source
  try {
    const [srcStat, outStat] = await Promise.all([stat(srcPath), stat(webpOut)])
    if (outStat.mtimeMs >= srcStat.mtimeMs) { console.log(`  skip  ${rel}`); return }
  } catch { /* doesn't exist yet */ }

  const pipeline = sharp(srcPath).resize(THUMB_W, THUMB_H, {
    fit: 'inside',
    withoutEnlargement: true,
  })

  // Primary: WebP (best compression)
  await pipeline.clone().webp({ quality: QUALITY }).toFile(webpOut)

  // Fallback: JPEG or PNG (same filename as source for <img> src fallback)
  const fallbackOut = join(outDir, basename(srcPath))
  const ext = extname(srcPath).toLowerCase()
  if (ext === '.png') {
    await pipeline.clone().png({ quality: QUALITY, compressionLevel: 8 }).toFile(fallbackOut)
  } else {
    await pipeline.clone().jpeg({ quality: QUALITY, mozjpeg: true }).toFile(fallbackOut)
  }

  console.log(`  ✓  ${rel}  →  webp + fallback`)
}

async function main() {
  console.log(`\nGenerating thumbnails (${THUMB_W}×${THUMB_H}, q${QUALITY}, WebP + fallback)\n`)
  const images = await collectImages(SRC_DIR)
  if (!images.length) { console.log('No images found.'); return }
  await Promise.all(images.map(processImage))
  console.log(`\nDone — ${images.length} image(s) processed.\n`)
}

main().catch(err => { console.error(err); process.exit(1) })
