'use client'

import React from 'react'

export type EventTemplateType =
  | 'wedding'
  | 'beach'
  | 'birthday'
  | 'batch'
  | 'festival'
  | 'party'
  | 'default'

interface EventBackgroundProps {
  template?: EventTemplateType | string | null
  mode?: 'light' | 'dark'
}

export default function EventBackground({
  template = 'default',
  mode = 'light',
}: EventBackgroundProps) {
  const normTemplate = (template || 'default').toLowerCase()

  if (normTemplate === 'wedding') {
    // 💍 Wedding / Poruwa Theme: Romantic champagne rose gold & floating golden bokeh
    return (
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div
          className={`absolute inset-0 ${
            mode === 'dark'
              ? 'bg-gradient-to-b from-[#1C1210] via-[#140E0C] to-[#0D0908]'
              : 'bg-gradient-to-b from-[#FFF5F2] via-[#FFF9F6] to-[#FFFDFB]'
          }`}
        />
        {/* Soft Rose Gold & Champagne Ambient Blobs */}
        <div className="absolute -top-20 left-1/4 w-[450px] h-[450px] bg-[#FFD5C8]/45 rounded-full blur-[100px] animate-pulse-glow" />
        <div
          className="absolute top-1/3 -right-20 w-[400px] h-[400px] bg-[#FFEAE4]/50 rounded-full blur-[110px] animate-float-slow"
          style={{ animationDelay: '2s' }}
        />
        <div className="absolute -bottom-20 left-10 w-[420px] h-[420px] bg-[#FFB7A2]/30 rounded-full blur-[100px] animate-pulse-glow" />

        {/* Floating Golden Bokeh Circles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-tr from-[#FFA387]/40 to-[#FFD5C8]/70 blur-xs animate-spark-twinkle"
            style={{
              width: `${12 + (i % 3) * 10}px`,
              height: `${12 + (i % 3) * 10}px`,
              left: `${15 + i * 14}%`,
              top: `${20 + ((i * 23) % 65)}%`,
              animationDelay: `${i * 1.2}s`,
              animationDuration: `${3.5 + (i % 3)}s`,
            }}
          />
        ))}
      </div>
    )
  }

  if (normTemplate === 'beach') {
    // 🌴 Outing / Beach / Road Trip Theme: Sunset peach & ocean sky breeze with animated waves
    return (
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div
          className={`absolute inset-0 ${
            mode === 'dark'
              ? 'bg-gradient-to-b from-[#14121A] via-[#140E0C] to-[#0A0706]'
              : 'bg-gradient-to-b from-[#FFEFEA] via-[#FFF8F5] to-[#FFFDFB]'
          }`}
        />
        {/* Sunbeam & Sunset Glow */}
        <div className="absolute -top-32 right-1/4 w-[500px] h-[500px] bg-[#FF9478]/35 rounded-full blur-[120px] animate-pulse-glow" />
        <div className="absolute top-1/2 -left-20 w-[450px] h-[450px] bg-[#FFD5C8]/40 rounded-full blur-[100px]" />

        {/* Rolling Ambient Wave Curves */}
        <div className="absolute bottom-0 inset-x-0 h-48 opacity-35 overflow-hidden">
          <div className="w-[140%] h-full bg-gradient-to-t from-[#FF7654]/15 to-transparent rounded-[100%] animate-wave-roll" />
        </div>
      </div>
    )
  }

  if (normTemplate === 'birthday') {
    // 🎂 Birthday Bash: Festive celebratory sparkles & joyful peach glow
    return (
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div
          className={`absolute inset-0 ${
            mode === 'dark'
              ? 'bg-gradient-to-b from-[#191014] via-[#140E0C] to-[#0F0A0B]'
              : 'bg-gradient-to-b from-[#FFF4F0] via-[#FFFDFB] to-[#FFEFEA]'
          }`}
        />
        <div className="absolute top-10 left-10 w-[400px] h-[400px] bg-[#FF7654]/25 rounded-full blur-[100px] animate-pulse-glow" />
        <div
          className="absolute bottom-20 right-10 w-[420px] h-[420px] bg-[#FFA387]/30 rounded-full blur-[110px] animate-float-slow"
          style={{ animationDelay: '1.5s' }}
        />

        {/* Confetti Particle Sparkles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-spark-twinkle"
            style={{
              width: `${8 + (i % 4) * 6}px`,
              height: `${8 + (i % 4) * 6}px`,
              backgroundColor: i % 2 === 0 ? '#FF7654' : '#FFA387',
              opacity: 0.5,
              left: `${10 + i * 11}%`,
              top: `${15 + ((i * 17) % 70)}%`,
              animationDelay: `${i * 0.7}s`,
            }}
          />
        ))}
      </div>
    )
  }

  if (normTemplate === 'batch') {
    // 🎓 University / Batch Reunion: Electric modern aurora gradient waves
    return (
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div
          className={`absolute inset-0 ${
            mode === 'dark'
              ? 'bg-gradient-to-b from-[#0F0E17] via-[#140E0C] to-[#09080E]'
              : 'bg-gradient-to-b from-[#FFF6F3] via-[#FFFDFB] to-[#FFEAE4]'
          }`}
        />
        <div className="absolute -top-24 left-1/3 w-[550px] h-[450px] bg-gradient-to-r from-[#FF7654]/30 to-[#FFA387]/20 rounded-full blur-[110px] animate-float-slow" />
        <div
          className="absolute bottom-10 right-1/4 w-[480px] h-[480px] bg-[#FFB7A2]/25 rounded-full blur-[120px] animate-pulse-glow"
          style={{ animationDelay: '3s' }}
        />
      </div>
    )
  }

  if (normTemplate === 'festival') {
    // 🏮 Festival / Avurudu / Vesak / Lanterns: Ambient glowing lantern orbs rising softly
    return (
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div
          className={`absolute inset-0 ${
            mode === 'dark'
              ? 'bg-gradient-to-b from-[#180E09] via-[#140E0C] to-[#0A0604]'
              : 'bg-gradient-to-b from-[#FFF3EC] via-[#FFF9F5] to-[#FFFDFB]'
          }`}
        />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#FF7654]/25 rounded-full blur-[120px] animate-pulse-glow" />

        {/* Rising Warm Lantern Orbs */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-t from-[#FF7654]/50 via-[#FFA387]/60 to-[#FFEAE4]/80 blur-xs"
            style={{
              width: `${20 + i * 8}px`,
              height: `${28 + i * 10}px`,
              left: `${18 + i * 16}%`,
              animation: `lanternRise ${14 + i * 3}s linear infinite`,
              animationDelay: `${i * 2.8}s`,
            }}
          />
        ))}
      </div>
    )
  }

  if (normTemplate === 'party') {
    // 🎉 Night Out / Party: Pulsing vibrant ambient disco peach glow
    return (
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div
          className={`absolute inset-0 ${
            mode === 'dark'
              ? 'bg-gradient-to-b from-[#1C0E14] via-[#140E0C] to-[#0B0608]'
              : 'bg-gradient-to-b from-[#FFEBE5] via-[#FFF8F6] to-[#FFFDFB]'
          }`}
        />
        <div className="absolute -top-10 -left-10 w-[450px] h-[450px] bg-[#FF7654]/30 rounded-full blur-[100px] animate-pulse-glow" />
        <div
          className="absolute -bottom-10 -right-10 w-[450px] h-[450px] bg-[#FFA387]/35 rounded-full blur-[100px] animate-pulse-glow"
          style={{ animationDelay: '2s' }}
        />
      </div>
    )
  }

  // Default Warm Signature Pixlane Peach
  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      <div
        className={`absolute inset-0 ${
          mode === 'dark'
            ? 'bg-gradient-to-b from-[#180F0D] via-[#140E0C] to-[#0D0807]'
            : 'bg-gradient-to-b from-[#FFF8F5] via-[#FFFDFB] to-[#FFEFEA]'
        }`}
      />
      <div className="absolute -top-20 right-1/4 w-[420px] h-[420px] bg-[#FFD5C8]/40 rounded-full blur-[110px] animate-pulse-glow" />
      <div
        className="absolute bottom-10 left-1/4 w-[420px] h-[420px] bg-[#FFEAE4]/50 rounded-full blur-[100px] animate-float-slow"
        style={{ animationDelay: '2s' }}
      />
    </div>
  )
}
