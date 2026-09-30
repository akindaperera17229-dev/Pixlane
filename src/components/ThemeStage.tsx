'use client'

import React, { useState } from 'react'
import { getTheme, EventTheme } from '@/lib/themeEngine'
import ThemeCanvas from './ThemeCanvas'
import { Sparkles, EyeOff } from 'lucide-react'

interface ThemeStageProps {
  themeId?: string | null
  eventName?: string | null
  paused?: boolean
  showEffectsToggle?: boolean
}

export default function ThemeStage({
  themeId = 'default',
  eventName,
  paused = false,
  showEffectsToggle = true,
}: ThemeStageProps) {
  const theme: EventTheme = getTheme(themeId, eventName)
  const [effectsEnabled, setEffectsEnabled] = useState(true)

  const c = theme.colors
  const isDark = theme.id === 'party' || c.bg.startsWith('#0') || c.bg.startsWith('#1')

  // Layer 1: Dynamic CSS Variables injected to reskin the entire page
  const cssVariables = `
    :root {
      --pix-bg: ${c.bg};
      --pix-card: ${c.bgCard};
      --pix-fg: ${c.fg};
      --pix-fg-muted: ${c.fgMuted};
      --pix-accent: ${c.accent};
      --pix-accent-hover: ${c.accentHover};
      --pix-border: ${c.border};
      --pix-badge-bg: ${c.badgeBg};
      --pix-badge-fg: ${c.badgeFg};
      --pix-header-bg: ${c.headerBg};
      color-scheme: ${isDark ? 'dark' : 'light'};
    }

    body {
      background-color: var(--pix-bg) !important;
      color: var(--pix-fg) !important;
    }

    /* Resilient Theme Matching across components */
    .theme-stage-active header {
      background-color: ${c.headerBg} !important;
      border-color: ${c.border} !important;
    }

    ${isDark ? `
    /* Full Dark Mode Adaptation for Party & Night themes */
    .theme-stage-active {
      color: ${c.fg} !important;
    }
    .theme-stage-active h1,
    .theme-stage-active h2,
    .theme-stage-active h3,
    .theme-stage-active h4 {
      color: ${c.fg} !important;
    }
    .theme-stage-active [class*="bg-white"],
    .theme-stage-active [class*="bg-[#FFFDFB]"],
    .theme-stage-active [class*="bg-[#FFF6F3]"] {
      background-color: ${c.bgCard} !important;
      border-color: ${c.border} !important;
      color: ${c.fg} !important;
    }
    .theme-stage-active [class*="text-[#221513]"],
    .theme-stage-active [class*="text-[#221411]"],
    .theme-stage-active [class*="text-[#25120E]"] {
      color: ${c.fg} !important;
    }
    .theme-stage-active [class*="text-[#6E554F]"],
    .theme-stage-active [class*="text-[#6C504A]"],
    .theme-stage-active [class*="text-[#735249]"],
    .theme-stage-active [class*="text-[#7D574E]"] {
      color: ${c.fgMuted} !important;
    }
    .theme-stage-active [class*="border-[#FFEAE4]"],
    .theme-stage-active [class*="border-[#FFD5C8]"],
    .theme-stage-active [class*="border-[#FFD7C9]"] {
      border-color: ${c.border} !important;
    }
    .theme-stage-active input,
    .theme-stage-active textarea,
    .theme-stage-active select {
      background-color: #1A0F0D !important;
      border-color: ${c.border} !important;
      color: ${c.fg} !important;
    }
    .theme-stage-active input::placeholder,
    .theme-stage-active textarea::placeholder {
      color: ${c.fgMuted} !important;
    }
    .theme-stage-active button[class*="bg-white"] {
      background-color: ${c.bgCard} !important;
      color: ${c.fg} !important;
      border-color: ${c.border} !important;
    }
    .theme-stage-active div[class*="border-dashed"] {
      background-color: rgba(31, 20, 17, 0.6) !important;
      border-color: ${c.border} !important;
    }
    ` : `
    .theme-stage-active [class*="border-[#FFEAE4]"],
    .theme-stage-active [class*="border-[#FFD5C8]"] {
      border-color: ${c.border} !important;
    }
    `}
  `

  return (
    <>
      {/* ─── LAYER 1: CSS VARIABLES INJECTION ─── */}
      <style dangerouslySetInnerHTML={{ __html: cssVariables }} />

      {/* ─── LAYER 2: BACKGROUND BASE & CENTERED SHADOW SILHOUETTE ─── */}
      <div
        className="fixed inset-0 pointer-events-none -z-30 transition-colors duration-500 overflow-hidden"
        style={{ backgroundColor: c.bg }}
      >
        {/* Soft Radial Ambient Glow */}
        <div
          className="absolute -top-32 left-1/4 w-[550px] h-[550px] rounded-full blur-[140px] opacity-25"
          style={{ backgroundColor: c.accent }}
        />
        <div
          className="absolute -bottom-32 right-1/4 w-[550px] h-[550px] rounded-full blur-[140px] opacity-15"
          style={{ backgroundColor: c.badgeFg }}
        />

        {/* Centered Delicate Shadow Silhouette (Sri Lankan Couple / Balloons / Disco / Palms) */}
        {theme.silhouetteSvg && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div
              className="w-[280px] sm:w-[380px] h-[380px] sm:h-[480px] transition-all duration-700 opacity-[0.07] sm:opacity-[0.09]"
              style={{ color: c.fg }}
              dangerouslySetInnerHTML={{ __html: theme.silhouetteSvg }}
            />
          </div>
        )}

        {/* 60% Dimming Gradient Overlay so text and photos remain 100% readable */}
        <div
          className="absolute inset-0 opacity-55"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 35%, transparent 0%, ${c.bg} 85%)`,
          }}
        />
      </div>

      {/* ─── LAYER 3: STATIC INLINE SVG CORNER DECORATIONS ─── */}
      <div className="fixed inset-0 pointer-events-none -z-20 overflow-hidden select-none">
        {theme.decorations.map((deco, idx) => {
          let posClass = 'top-4 left-4'
          if (deco.position === 'top-right') posClass = 'top-4 right-4'
          else if (deco.position === 'bottom-left') posClass = 'bottom-6 left-4'
          else if (deco.position === 'bottom-right') posClass = 'bottom-6 right-4'

          return (
            <div
              key={idx}
              className={`fixed ${posClass} transition-opacity duration-300`}
              style={{
                width: `${deco.size}px`,
                height: `${deco.size}px`,
                opacity: deco.opacity,
                color: c.accent,
              }}
              dangerouslySetInnerHTML={{ __html: deco.svg }}
            />
          )
        })}
      </div>

      {/* ─── LAYER 4: CANVAS PARTICLE ANIMATION (Strictly behind content at -z-10) ─── */}
      {effectsEnabled && (
        <ThemeCanvas
          type={theme.animation}
          colors={theme.particleColors}
          paused={paused}
        />
      )}

      {/* ─── OPTIONAL: EFFECTS TOGGLE (Battery / Power Saver) ─── */}
      {showEffectsToggle && theme.animation !== 'none' && (
        <button
          type="button"
          onClick={() => setEffectsEnabled(!effectsEnabled)}
          className="fixed top-20 right-4 z-30 flex items-center gap-1.5 bg-black/35 hover:bg-black/55 text-white/80 hover:text-white backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold border border-white/10 transition-all opacity-60 hover:opacity-100"
          title={effectsEnabled ? 'Turn off animated effects to save battery' : 'Turn on animated effects'}
        >
          {effectsEnabled ? (
            <>
              <Sparkles className="w-3 h-3 text-[#FF7654]" />
              <span className="hidden sm:inline">Effects ON</span>
            </>
          ) : (
            <>
              <EyeOff className="w-3 h-3" />
              <span>Effects OFF</span>
            </>
          )}
        </button>
      )}
    </>
  )
}
