import { writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')

// SVG icon — Peach camera lens
function makeSvg(size) {
  const r = size * 0.22 // corner radius
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
    <linearGradient id="peachGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF7654"/>
      <stop offset="100%" stop-color="#FFA387"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${r}" fill="url(#peachGradient)"/>
  <!-- camera top notch -->
  <rect x="${notchX}" y="${notchY}" width="${notchW}" height="${notchH}" rx="${notchH/2}" fill="white" opacity="0.95"/>
  <!-- outer lens ring -->
  <circle cx="${cx}" cy="${cy}" r="${outerR}" fill="none" stroke="white" stroke-width="${size*0.065}" opacity="0.95"/>
  <!-- inner lens circle -->
  <circle cx="${cx}" cy="${cy}" r="${innerR}" fill="white" opacity="0.95"/>
</svg>`
}

;[192, 512].forEach(size => {
  const svg = makeSvg(size)
  const path = join(publicDir, `icon-${size}.svg`)
  writeFileSync(path, svg, 'utf8')
  console.log(`✓ Generated: public/icon-${size}.svg`)
})

writeFileSync(join(publicDir, 'icon.svg'), makeSvg(512), 'utf8')
console.log('✓ Generated: public/icon.svg')
