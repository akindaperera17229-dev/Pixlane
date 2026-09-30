/**
 * Generates Pixlane PNG icons using Sharp (built-in with Next.js image pipeline)
 * or falls back to writing an SVG as PNG placeholder.
 * Run: node scripts/generate-icons.mjs
 */
import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')

// SVG icon — teal camera lens
function makeSvg(size) {
  const r = size * 0.22  // corner radius
  const cx = size / 2
  const cy = size / 2
  const outerR = size * 0.275
  const innerR = size * 0.14
  const notchW = size * 0.125
  const notchH = size * 0.06
  const notchX = cx - notchW / 2
  const notchY = size * 0.14

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f766e"/>
      <stop offset="100%" stop-color="#0d9488"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${r}" fill="url(#g)"/>
  <!-- notch -->
  <rect x="${notchX}" y="${notchY}" width="${notchW}" height="${notchH}" rx="${notchH/2}" fill="white" opacity="0.9"/>
  <!-- lens ring -->
  <circle cx="${cx}" cy="${cy}" r="${outerR}" fill="none" stroke="white" stroke-width="${size*0.065}" opacity="0.95"/>
  <!-- inner lens -->
  <circle cx="${cx}" cy="${cy}" r="${innerR}" fill="white" opacity="0.9"/>
</svg>`
}

// Write SVG files (browsers accept SVG for PWA icons)
;[192, 512].forEach(size => {
  const svg = makeSvg(size)
  const path = join(publicDir, `icon-${size}.svg`)
  writeFileSync(path, svg, 'utf8')
  console.log(`✓ Written: public/icon-${size}.svg`)
})

// Also write a simple SVG as icon.svg
writeFileSync(join(publicDir, 'icon.svg'), makeSvg(512), 'utf8')
console.log('✓ Written: public/icon.svg')
console.log('Done! Update manifest.json to use .svg if PNG is not available.')
