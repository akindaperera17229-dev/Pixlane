/**
 * Pixlane Event Theme Engine
 * 
 * 4-Layer Architecture inspired by high-end event platforms:
 * 1. Dynamic CSS variables (--pix-bg, --pix-fg, --pix-accent, etc.)
 * 2. Background silhouette shadow image (Sri Lankan wedding couple, balloons, disco lights, etc.)
 * 3. Static inline SVG corner decorations (12-16% opacity, vector crispness, 0 HTTP requests)
 * 4. Lightweight, GPU-friendly HTML5 Canvas particle animation (Falling rose petals, disco rays, confetti)
 */

export interface ThemeColors {
  bg: string
  bgCard: string
  fg: string
  fgMuted: string
  accent: string
  accentHover: string
  border: string
  badgeBg: string
  badgeFg: string
  headerBg: string
}

export type AnimationType = 'petals' | 'confetti' | 'disco' | 'lanterns' | 'fireworks' | 'bokeh' | 'none'

export interface ThemeDecoration {
  name: string
  svg: string
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  opacity: number
  size: number
}

export interface EventTheme {
  id: string
  name: string
  emoji: string
  tagline: string
  fontFamily: 'serif' | 'cursive' | 'cinzel' | 'sans'
  colors: ThemeColors
  silhouetteSvg: string // Centered background silhouette shadow
  decorations: ThemeDecoration[]
  animation: AnimationType
  particleColors: string[]
}

// ─── STATIC INLINE SVG CORNER DECORATIONS (Zero HTTP request, vector crispness) ───
const CORNER_SVGS = {
  lotus: `<svg viewBox="0 0 100 100" fill="currentColor"><path d="M50 15 C45 35, 20 45, 10 70 C30 75, 45 60, 50 85 C55 60, 70 75, 90 70 C80 45, 55 35, 50 15 Z M50 35 C42 50, 30 55, 25 70 C38 70, 46 60, 50 78 C54 60, 62 70, 75 70 C70 55, 58 50, 50 35 Z"/></svg>`,
  diya: `<svg viewBox="0 0 100 100" fill="currentColor"><path d="M50 10 C46 25, 44 32, 50 45 C56 32, 54 25, 50 10 Z"/><path d="M15 55 C15 78, 30 88, 50 88 C70 88, 85 78, 85 55 C85 52, 15 52, 15 55 Z"/></svg>`,
  sparkle: `<svg viewBox="0 0 100 100" fill="currentColor"><path d="M50 0 L58 38 L98 46 L58 54 L50 98 L42 54 L2 46 L42 38 Z"/></svg>`,
  palmLeaf: `<svg viewBox="0 0 100 100" fill="currentColor"><path d="M10 90 Q40 50, 90 10 Q70 40, 75 50 Q55 55, 60 70 Q40 70, 42 85 Q25 82, 10 90 Z"/></svg>`,
  balloon: `<svg viewBox="0 0 100 100" fill="currentColor"><path d="M50 10 C28 10, 20 35, 20 50 C20 70, 45 82, 48 88 L52 88 C55 82, 80 70, 80 50 C80 35, 72 10, 50 10 Z M50 90 L46 95 L54 95 Z"/></svg>`,
  lantern: `<svg viewBox="0 0 100 100" fill="currentColor"><rect x="35" y="15" width="30" height="6" rx="3"/><path d="M30 25 C25 45, 25 65, 30 80 L70 80 C75 65, 75 45, 70 25 Z"/><rect x="38" y="82" width="24" height="6" rx="2"/><circle cx="50" cy="52" r="10"/></svg>`,
  starBurst: `<svg viewBox="0 0 100 100" fill="currentColor"><path d="M50 5 L55 38 L88 20 L66 48 L98 50 L66 52 L88 80 L55 62 L50 95 L45 62 L12 80 L34 52 L2 50 L34 48 L12 20 L45 38 Z"/></svg>`,
}

// ─── SHADOW SILHOUETTE SVGS (Centered in background at subtle opacity) ───
const SILHOUETTE_SVGS = {
  // Sri Lankan Wedding Couple (Poruwa groom in Mul Anduma & bride in Osari holding bouquet)
  sriLankanCouple: `<svg viewBox="0 0 300 400" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <!-- Groom (Left) -->
    <path d="M90 70 C90 55, 105 45, 120 45 C135 45, 145 55, 145 70 C145 80, 138 90, 125 95 C125 102, 140 110, 155 125 C160 130, 162 145, 162 165 L158 260 L145 380 L115 380 L112 270 L98 270 L95 380 L70 380 L62 250 L65 160 C65 140, 75 120, 90 110 Z"/>
    <!-- Groom Traditional Nilame Hat/Crown silhouette -->
    <path d="M102 45 L118 20 L134 45 Z M98 48 L138 48 L134 52 L102 52 Z"/>
    <!-- Bride (Right) in Osari Saree -->
    <path d="M175 75 C175 62, 185 52, 198 52 C210 52, 220 62, 220 75 C220 86, 212 95, 202 98 C215 110, 235 125, 238 145 C240 160, 240 210, 248 300 L255 380 L158 380 L165 300 C172 210, 172 150, 168 128 C164 125, 168 110, 175 98 Z"/>
    <!-- Bride Saree Pallu & Floral Hair Veil drape -->
    <path d="M198 55 C215 55, 228 70, 226 95 C224 115, 232 170, 242 240 L234 240 C222 175, 216 115, 212 90 Z"/>
    <!-- Floral Garland / Poruwa Bouquet center -->
    <circle cx="160" cy="180" r="14" opacity="0.8"/>
  </svg>`,

  // Birthday Balloons Cluster silhouette
  birthdayBalloons: `<svg viewBox="0 0 300 400" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <!-- Balloon 1 (Center) -->
    <path d="M150 40 C110 40, 95 80, 95 120 C95 170, 140 195, 147 205 L153 205 C160 195, 205 170, 205 120 C205 80, 190 40, 150 40 Z"/>
    <path d="M145 208 L155 208 L152 215 L148 215 Z"/>
    <path d="M150 215 Q155 270, 148 330 Q145 360, 150 380" fill="none" stroke="currentColor" stroke-width="2"/>
    <!-- Balloon 2 (Left) -->
    <path d="M85 90 C55 90, 45 120, 45 150 C45 190, 80 210, 83 218 L87 218 C90 210, 125 190, 125 150 C125 120, 115 90, 85 90 Z"/>
    <path d="M85 220 Q95 280, 145 350" fill="none" stroke="currentColor" stroke-width="2"/>
    <!-- Balloon 3 (Right) -->
    <path d="M215 90 C185 90, 175 120, 175 150 C175 190, 210 210, 213 218 L217 218 C220 210, 255 190, 255 150 C255 120, 245 90, 215 90 Z"/>
    <path d="M215 220 Q205 280, 155 350" fill="none" stroke="currentColor" stroke-width="2"/>
    <!-- Star Sparkles around -->
    <polygon points="150,15 154,27 167,31 154,35 150,47 146,35 133,31 146,27" opacity="0.6"/>
    <polygon points="60,60 63,70 73,73 63,76 60,86 57,76 47,73 57,70" opacity="0.5"/>
    <polygon points="240,60 243,70 253,73 243,76 240,86 237,76 227,73 237,70" opacity="0.5"/>
  </svg>`,

  // Disco Ball & Radiant Light Beams (Parties / Night Out)
  discoLights: `<svg viewBox="0 0 300 400" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <!-- Hanging cord -->
    <line x1="150" y1="0" x2="150" y2="70" stroke="currentColor" stroke-width="3"/>
    <!-- Disco ball sphere -->
    <circle cx="150" cy="130" r="60"/>
    <!-- Facet Grid Lines -->
    <circle cx="150" cy="130" r="58" fill="none" stroke="#FFF" stroke-width="2" opacity="0.2"/>
    <path d="M92 130 Q150 110, 208 130 M92 130 Q150 150, 208 130 M150 72 Q130 130, 150 188 M150 72 Q170 130, 150 188" fill="none" stroke="#FFF" stroke-width="1.5" opacity="0.3"/>
    <!-- Radial Light Beams -->
    <polygon points="150,130 40,30 65,15" opacity="0.3"/>
    <polygon points="150,130 250,20 275,35" opacity="0.3"/>
    <polygon points="150,130 10,180 15,210" opacity="0.25"/>
    <polygon points="150,130 285,180 290,210" opacity="0.25"/>
    <polygon points="150,130 60,350 90,365" opacity="0.25"/>
    <polygon points="150,130 240,350 210,365" opacity="0.25"/>
    <polygon points="150,130 135,390 165,390" opacity="0.3"/>
  </svg>`,

  // Tropical Coconut Palms & Coastline (Outing & Beach Trips)
  tropicalPalms: `<svg viewBox="0 0 300 400" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <!-- Left Palm Trunk -->
    <path d="M70 380 Q90 250, 130 150 L140 152 Q100 250, 85 380 Z"/>
    <!-- Palm Fronds -->
    <path d="M135 150 Q90 110, 30 140 Q80 145, 135 150 Z"/>
    <path d="M135 150 Q110 80, 70 70 Q105 105, 135 150 Z"/>
    <path d="M135 150 Q150 60, 170 50 Q160 100, 135 150 Z"/>
    <path d="M135 150 Q190 90, 220 105 Q175 130, 135 150 Z"/>
    <path d="M135 150 Q180 160, 210 190 Q165 170, 135 150 Z"/>
    <!-- Gentle Shoreline Wave Dunes -->
    <path d="M0 350 Q80 320, 180 360 Q240 370, 300 340 L300 400 L0 400 Z" opacity="0.6"/>
  </svg>`,

  // Traditional Brass Oil Lamp / Pāna (Festivals & Traditions)
  traditionalLamp: `<svg viewBox="0 0 300 400" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <!-- Top Cock / Bird symbol -->
    <path d="M150 35 C145 25, 140 15, 150 10 C160 15, 155 25, 150 35 Z M147 35 L153 35 L151 55 L149 55 Z"/>
    <!-- Flame Silhouette -->
    <path d="M150 55 C143 70, 142 80, 150 95 C158 80, 157 70, 150 55 Z"/>
    <!-- Oil Dish (Pāna) -->
    <path d="M100 105 C100 125, 120 135, 150 135 C180 135, 200 125, 200 105 L190 100 L110 100 Z"/>
    <!-- Central Brass Pillar -->
    <rect x="145" y="135" width="10" height="170" rx="3"/>
    <path d="M135 190 L165 190 L160 200 L140 200 Z"/>
    <path d="M130 250 L170 250 L165 260 L135 260 Z"/>
    <!-- Solid Brass Base -->
    <path d="M110 305 L190 305 L215 365 L85 365 Z"/>
  </svg>`,
}

// ─── COMPLETE THEME CATALOG ───
export const EVENT_THEMES: Record<string, EventTheme> = {
  // 1. 💍 Wedding & Poruwa
  wedding: {
    id: 'wedding',
    name: 'Poruwa & Wedding',
    emoji: '💍',
    tagline: 'Sri Lankan Poruwa couple silhouette with falling rose petals',
    fontFamily: 'cursive',
    colors: {
      bg: '#FFF8F6',
      bgCard: '#FFFFFF',
      fg: '#2A140E',
      fgMuted: '#7D574E',
      accent: '#E0533C',
      accentHover: '#C94029',
      border: '#FFD9CF',
      badgeBg: '#FFEAE3',
      badgeFg: '#C83B18',
      headerBg: 'rgba(255, 248, 246, 0.88)',
    },
    silhouetteSvg: SILHOUETTE_SVGS.sriLankanCouple,
    decorations: [
      { name: 'lotus', svg: CORNER_SVGS.lotus, position: 'top-left', opacity: 0.13, size: 130 },
      { name: 'sparkle', svg: CORNER_SVGS.sparkle, position: 'top-right', opacity: 0.14, size: 65 },
      { name: 'lotus', svg: CORNER_SVGS.lotus, position: 'bottom-right', opacity: 0.13, size: 120 },
      { name: 'sparkle', svg: CORNER_SVGS.sparkle, position: 'bottom-left', opacity: 0.12, size: 60 },
    ],
    animation: 'petals', // Falling rose petals!
    particleColors: ['#E63946', '#FF758F', '#FFA387', '#FFCCD5', '#D4AF37'],
  },

  // 2. 🌴 Beach & Outing Trip
  beach: {
    id: 'beach',
    name: 'Outing & Beach Trip',
    emoji: '🌴',
    tagline: 'Tropical palm silhouette with gentle coastal sun sparkles',
    fontFamily: 'cinzel',
    colors: {
      bg: '#FFFDF9',
      bgCard: '#FFFFFF',
      fg: '#221513',
      fgMuted: '#6E554F',
      accent: '#FF7654',
      accentHover: '#F45732',
      border: '#FFE5D8',
      badgeBg: '#FFEBE3',
      badgeFg: '#D43E19',
      headerBg: 'rgba(255, 253, 249, 0.88)',
    },
    silhouetteSvg: SILHOUETTE_SVGS.tropicalPalms,
    decorations: [
      { name: 'palm', svg: CORNER_SVGS.palmLeaf, position: 'top-right', opacity: 0.14, size: 150 },
      { name: 'sun', svg: CORNER_SVGS.starBurst, position: 'top-left', opacity: 0.11, size: 80 },
      { name: 'palm', svg: CORNER_SVGS.palmLeaf, position: 'bottom-left', opacity: 0.13, size: 130 },
    ],
    animation: 'bokeh',
    particleColors: ['#FF7654', '#FFA387', '#FFD29D', '#F9CA24', '#FFEAA7'],
  },

  // 3. 🎂 Birthday Bash
  birthday: {
    id: 'birthday',
    name: 'Birthday Bash',
    emoji: '🎂',
    tagline: 'Floating balloon cluster silhouette with celebratory confetti',
    fontFamily: 'cinzel',
    colors: {
      bg: '#FFF9F6',
      bgCard: '#FFFFFF',
      fg: '#25120E',
      fgMuted: '#735249',
      accent: '#FF6B4A',
      accentHover: '#E84E29',
      border: '#FFD9CB',
      badgeBg: '#FFE8DF',
      badgeFg: '#CC3A17',
      headerBg: 'rgba(255, 249, 246, 0.88)',
    },
    silhouetteSvg: SILHOUETTE_SVGS.birthdayBalloons,
    decorations: [
      { name: 'balloon', svg: CORNER_SVGS.balloon, position: 'top-left', opacity: 0.13, size: 95 },
      { name: 'sparkle', svg: CORNER_SVGS.sparkle, position: 'top-right', opacity: 0.15, size: 70 },
      { name: 'balloon', svg: CORNER_SVGS.balloon, position: 'bottom-right', opacity: 0.12, size: 85 },
      { name: 'sparkle', svg: CORNER_SVGS.sparkle, position: 'bottom-left', opacity: 0.14, size: 65 },
    ],
    animation: 'confetti',
    particleColors: ['#FF6B4A', '#FF9F43', '#EE5253', '#0ABDE3', '#10AC84', '#F368E0', '#FF9FF3'],
  },

  // 4. 🎉 Night Party & DJ
  party: {
    id: 'party',
    name: 'Party Gala & Night Out',
    emoji: '🎉',
    tagline: 'Disco ball & radiant light beams with canvas fireworks',
    fontFamily: 'cinzel',
    colors: {
      bg: '#140D0B',
      bgCard: '#1F1411',
      fg: '#FFF5F0',
      fgMuted: '#C2A39B',
      accent: '#FF7654',
      accentHover: '#FFA085',
      border: '#3F251E',
      badgeBg: '#341A13',
      badgeFg: '#FF9478',
      headerBg: 'rgba(20, 13, 11, 0.92)',
    },
    silhouetteSvg: SILHOUETTE_SVGS.discoLights,
    decorations: [
      { name: 'star', svg: CORNER_SVGS.starBurst, position: 'top-left', opacity: 0.15, size: 85 },
      { name: 'sparkle', svg: CORNER_SVGS.sparkle, position: 'top-right', opacity: 0.16, size: 75 },
      { name: 'star', svg: CORNER_SVGS.starBurst, position: 'bottom-right', opacity: 0.13, size: 90 },
      { name: 'sparkle', svg: CORNER_SVGS.sparkle, position: 'bottom-left', opacity: 0.14, size: 70 },
    ],
    animation: 'fireworks',
    particleColors: ['#FF7654', '#FFA387', '#FFD29D', '#F9CA24', '#F0932B', '#EB4D4B'],
  },

  // 5. 🏮 Festival & Tradition (Avurudu / Vesak / Pāna)
  festival: {
    id: 'festival',
    name: 'Festival & Tradition',
    emoji: '🏮',
    tagline: 'Traditional brass oil lamp silhouette with floating lantern embers',
    fontFamily: 'cinzel',
    colors: {
      bg: '#FFF6EE',
      bgCard: '#FFFFFF',
      fg: '#2B1306',
      fgMuted: '#7E5337',
      accent: '#E65C00',
      accentHover: '#C94F00',
      border: '#FFDEC0',
      badgeBg: '#FFEAD4',
      badgeFg: '#B34700',
      headerBg: 'rgba(255, 246, 238, 0.88)',
    },
    silhouetteSvg: SILHOUETTE_SVGS.traditionalLamp,
    decorations: [
      { name: 'diya', svg: CORNER_SVGS.diya, position: 'top-left', opacity: 0.15, size: 105 },
      { name: 'lantern', svg: CORNER_SVGS.lantern, position: 'top-right', opacity: 0.14, size: 105 },
      { name: 'diya', svg: CORNER_SVGS.diya, position: 'bottom-right', opacity: 0.14, size: 95 },
    ],
    animation: 'lanterns',
    particleColors: ['#FF9F43', '#E65C00', '#F39C12', '#F1C40F', '#FFD29D'],
  },

  // 6. 🎓 Batch & University Reunion
  batch: {
    id: 'batch',
    name: 'Uni Batch & Reunion',
    emoji: '🎓',
    tagline: 'Campus celebration stars with canvas sparkler burst',
    fontFamily: 'cinzel',
    colors: {
      bg: '#FFF8F6',
      bgCard: '#FFFFFF',
      fg: '#221411',
      fgMuted: '#6C504A',
      accent: '#FF7654',
      accentHover: '#F45732',
      border: '#FFD7C9',
      badgeBg: '#FFE9E1',
      badgeFg: '#CF3B16',
      headerBg: 'rgba(255, 248, 246, 0.88)',
    },
    silhouetteSvg: SILHOUETTE_SVGS.birthdayBalloons,
    decorations: [
      { name: 'star', svg: CORNER_SVGS.starBurst, position: 'top-right', opacity: 0.13, size: 95 },
      { name: 'sparkle', svg: CORNER_SVGS.sparkle, position: 'top-left', opacity: 0.14, size: 75 },
      { name: 'star', svg: CORNER_SVGS.starBurst, position: 'bottom-left', opacity: 0.11, size: 80 },
    ],
    animation: 'fireworks',
    particleColors: ['#FF7654', '#FFA387', '#6C5CE7', '#0984E3', '#00CEC9', '#FDCB6E'],
  },

  // 7. Signature Default
  default: {
    id: 'default',
    name: 'Signature Peach',
    emoji: '🍑',
    tagline: 'Clean, warm minimalist aesthetic',
    fontFamily: 'cinzel',
    colors: {
      bg: '#FFFDFB',
      bgCard: '#FFFFFF',
      fg: '#221513',
      fgMuted: '#6E554F',
      accent: '#FF7654',
      accentHover: '#F45732',
      border: '#FFEAE4',
      badgeBg: '#FFEAE4',
      badgeFg: '#D43E19',
      headerBg: 'rgba(255, 253, 251, 0.88)',
    },
    silhouetteSvg: SILHOUETTE_SVGS.birthdayBalloons,
    decorations: [
      { name: 'sparkle', svg: CORNER_SVGS.sparkle, position: 'top-right', opacity: 0.11, size: 65 },
      { name: 'sparkle', svg: CORNER_SVGS.sparkle, position: 'bottom-left', opacity: 0.10, size: 55 },
    ],
    animation: 'bokeh',
    particleColors: ['#FF7654', '#FFA387', '#FFD5C8'],
  },
}

export function guessThemeFromText(text?: string | null): string {
  if (!text) return 'default'
  const lower = text.toLowerCase()
  if (lower.includes('wedding') || lower.includes('poruwa') || lower.includes('marriage') || lower.includes('bride') || lower.includes('groom')) return 'wedding'
  if (lower.includes('birthday') || lower.includes('bday') || lower.includes('born') || lower.includes('cake')) return 'birthday'
  if (lower.includes('party') || lower.includes('club') || lower.includes('disco') || lower.includes('night') || lower.includes('dj')) return 'party'
  if (lower.includes('beach') || lower.includes('trip') || lower.includes('outing') || lower.includes('tour') || lower.includes('hike') || lower.includes('ella') || lower.includes('sea')) return 'beach'
  if (lower.includes('vesak') || lower.includes('avurudu') || lower.includes('festival') || lower.includes('temple') || lower.includes('perahera') || lower.includes('poson') || lower.includes('diwali')) return 'festival'
  if (lower.includes('batch') || lower.includes('campus') || lower.includes('uni') || lower.includes('school') || lower.includes('college')) return 'batch'
  return 'default'
}

export function getTheme(id?: string | null, fallbackText?: string | null): EventTheme {
  if (id && id !== 'default') {
    const cleanId = id.toLowerCase().trim()
    if (EVENT_THEMES[cleanId]) return EVENT_THEMES[cleanId]
  }
  if (fallbackText) {
    const guessed = guessThemeFromText(fallbackText)
    if (EVENT_THEMES[guessed]) return EVENT_THEMES[guessed]
  }
  return EVENT_THEMES.default
}
