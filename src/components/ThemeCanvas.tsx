'use client'

import React, { useEffect, useRef } from 'react'
import { AnimationType } from '@/lib/themeEngine'

interface ThemeCanvasProps {
  type: AnimationType
  colors?: string[]
  paused?: boolean // pause when lightbox or modal is open
}

export default function ThemeCanvas({
  type,
  colors = ['#FF7654', '#FFA387', '#FFD29D'],
  paused = false,
}: ThemeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (type === 'none') return

    // 1. Check prefers-reduced-motion
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let isTabVisible = !document.hidden
    let width = 0
    let height = 0
    let dpr = 1

    // Scale by devicePixelRatio for iPhone / Android high-DPI screens
    function resize() {
      if (!canvas) return
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx?.scale(dpr, dpr)
    }

    resize()
    window.addEventListener('resize', resize)

    // Tab visibility listener — auto-pause in background tabs
    function handleVisibilityChange() {
      isTabVisible = !document.hidden
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    const isMobile = window.innerWidth < 768
    const countScale = isMobile ? 0.6 : 1.0

    // ─── 1. FALLING ROSE PETALS ENGINE (WEDDINGS) ───
    interface RosePetal {
      x: number
      y: number
      size: number
      vy: number
      vx: number
      rotation: number
      vRot: number
      flipAngle: number
      vFlip: number
      swayAngle: number
      vSway: number
      color: string
      alpha: number
    }

    const petals: RosePetal[] = []
    if (type === 'petals') {
      const maxPetals = Math.floor(28 * countScale)
      const petalPalette = ['#E63946', '#FF758F', '#FFA387', '#FFCCD5', '#D43E19']
      for (let i = 0; i < maxPetals; i++) {
        petals.push({
          x: Math.random() * width,
          y: Math.random() * (height + 100) - 100,
          size: 7 + Math.random() * 8,
          vy: 0.9 + Math.random() * 1.3,
          vx: 0.2 + Math.random() * 0.6,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.03,
          flipAngle: Math.random() * Math.PI * 2,
          vFlip: 0.02 + Math.random() * 0.04,
          swayAngle: Math.random() * Math.PI * 2,
          vSway: 0.015 + Math.random() * 0.025,
          color: petalPalette[Math.floor(Math.random() * petalPalette.length)],
          alpha: 0.55 + Math.random() * 0.35,
        })
      }
    }

    // ─── 2. FIREWORKS ENGINE ───
    interface Rocket {
      x: number
      y: number
      targetY: number
      vx: number
      vy: number
      color: string
    }

    interface SparkParticle {
      x: number
      y: number
      vx: number
      vy: number
      alpha: number
      decay: number
      color: string
      size: number
    }

    const rockets: Rocket[] = []
    const sparks: SparkParticle[] = []
    let lastLaunch = 0

    function launchRocket() {
      const x = width * (0.2 + Math.random() * 0.6)
      const targetY = height * (0.15 + Math.random() * 0.35)
      const vy = - (7 + Math.random() * 3)
      const color = colors[Math.floor(Math.random() * colors.length)]
      rockets.push({ x, y: height, targetY, vx: (Math.random() - 0.5) * 1.5, vy, color })
    }

    function explodeRocket(rocket: Rocket) {
      const particleCount = Math.floor((isMobile ? 35 : 65) * countScale)
      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2
        const speed = 1.2 + Math.random() * 4.2
        const color = colors[Math.floor(Math.random() * colors.length)]
        sparks.push({
          x: rocket.x,
          y: rocket.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          decay: 0.012 + Math.random() * 0.016,
          color,
          size: 1.5 + Math.random() * 2,
        })
      }
    }

    // ─── 3. CONFETTI ENGINE (BIRTHDAYS) ───
    interface ConfettiPiece {
      x: number
      y: number
      vx: number
      vy: number
      rotation: number
      vRot: number
      width: number
      height: number
      color: string
      tiltAngle: number
    }

    const confettiPieces: ConfettiPiece[] = []
    if (type === 'confetti') {
      const maxConfetti = Math.floor(40 * countScale)
      for (let i = 0; i < maxConfetti; i++) {
        confettiPieces.push({
          x: Math.random() * width,
          y: Math.random() * height - height,
          vx: (Math.random() - 0.5) * 1.8,
          vy: 1.2 + Math.random() * 2.2,
          rotation: Math.random() * 360,
          vRot: (Math.random() - 0.5) * 4,
          width: 8 + Math.random() * 6,
          height: 5 + Math.random() * 5,
          color: colors[Math.floor(Math.random() * colors.length)],
          tiltAngle: Math.random() * Math.PI,
        })
      }
    }

    // ─── 4. BOKEH & LANTERNS ENGINE ───
    interface BokehOrb {
      x: number
      y: number
      r: number
      vy: number
      vx: number
      alpha: number
      maxAlpha: number
      color: string
      growing: boolean
    }

    const orbs: BokehOrb[] = []
    if (type === 'bokeh' || type === 'lanterns') {
      const maxOrbs = Math.floor((type === 'lanterns' ? 12 : 20) * countScale)
      for (let i = 0; i < maxOrbs; i++) {
        orbs.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: type === 'lanterns' ? 5 + Math.random() * 8 : 10 + Math.random() * 22,
          vy: - (0.3 + Math.random() * 0.6),
          vx: (Math.random() - 0.5) * 0.4,
          alpha: Math.random() * 0.4,
          maxAlpha: 0.3 + Math.random() * 0.3,
          color: colors[Math.floor(Math.random() * colors.length)],
          growing: Math.random() > 0.5,
        })
      }
    }

    // ─── 5. DISCO LIGHT BEAMS ENGINE ───
    let discoAngle = 0

    // ─── ANIMATION LOOP ───
    function loop(timestamp: number) {
      if (!ctx) return

      if (!paused && isTabVisible) {
        ctx.clearRect(0, 0, width, height)

        // 1. FALLING ROSE PETALS
        if (type === 'petals') {
          for (const p of petals) {
            p.y += p.vy
            p.x += Math.sin(p.swayAngle) * 0.9 + p.vx * 0.3
            p.rotation += p.vRot
            p.flipAngle += p.vFlip
            p.swayAngle += p.vSway

            // Reset when falling past the bottom of the screen
            if (p.y > height + 20) {
              p.y = -20
              p.x = Math.random() * width
            }

            // Draw organic rose petal shape with 3D flip effect
            ctx.save()
            ctx.translate(p.x, p.y)
            ctx.rotate(p.rotation)
            ctx.scale(Math.cos(p.flipAngle), 1) // 3D tumbling flip!
            ctx.fillStyle = p.color
            ctx.globalAlpha = p.alpha

            ctx.beginPath()
            ctx.moveTo(0, -p.size)
            ctx.bezierCurveTo(p.size * 0.8, -p.size * 0.8, p.size, p.size * 0.4, 0, p.size)
            ctx.bezierCurveTo(-p.size, p.size * 0.4, -p.size * 0.8, -p.size * 0.8, 0, -p.size)
            ctx.fill()

            ctx.restore()
          }
        }

        // 2. FIREWORKS
        else if (type === 'fireworks') {
          if (timestamp - lastLaunch > 1100) {
            launchRocket()
            lastLaunch = timestamp
          }

          for (let i = rockets.length - 1; i >= 0; i--) {
            const r = rockets[i]
            r.x += r.vx
            r.y += r.vy
            r.vy *= 0.99

            ctx.fillStyle = r.color
            ctx.shadowColor = r.color
            ctx.shadowBlur = 6
            ctx.beginPath()
            ctx.arc(r.x, r.y, 2, 0, Math.PI * 2)
            ctx.fill()

            if (r.y <= r.targetY || r.vy >= -0.5) {
              explodeRocket(r)
              rockets.splice(i, 1)
            }
          }

          for (let i = sparks.length - 1; i >= 0; i--) {
            const s = sparks[i]
            s.x += s.vx
            s.y += s.vy
            s.vx *= 0.98
            s.vy = s.vy * 0.98 + 0.05
            s.alpha -= s.decay

            if (s.alpha <= 0) {
              sparks.splice(i, 1)
              continue
            }

            ctx.save()
            ctx.globalAlpha = Math.max(0, s.alpha)
            ctx.fillStyle = s.color
            ctx.shadowColor = s.color
            ctx.shadowBlur = 6
            ctx.beginPath()
            ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
            ctx.fill()
            ctx.restore()
          }
        }

        // 3. CONFETTI
        else if (type === 'confetti') {
          for (const p of confettiPieces) {
            p.y += p.vy
            p.x += Math.sin(p.tiltAngle) * 1.3
            p.tiltAngle += 0.03
            p.rotation += p.vRot

            if (p.y > height + 20) {
              p.y = -20
              p.x = Math.random() * width
            }

            ctx.save()
            ctx.translate(p.x, p.y)
            ctx.rotate((p.rotation * Math.PI) / 180)
            ctx.fillStyle = p.color
            ctx.globalAlpha = 0.65
            ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height)
            ctx.restore()
          }
        }

        // 4. BOKEH & LANTERNS
        else if (type === 'bokeh' || type === 'lanterns') {
          for (const o of orbs) {
            o.y += o.vy
            o.x += Math.sin(o.y * 0.01) * 0.3

            if (o.growing) {
              o.alpha += 0.004
              if (o.alpha >= o.maxAlpha) o.growing = false
            } else {
              o.alpha -= 0.004
              if (o.alpha <= 0.05) o.growing = true
            }

            if (o.y < -50) {
              o.y = height + 30
              o.x = Math.random() * width
            }

            ctx.save()
            ctx.globalAlpha = Math.max(0, o.alpha)
            ctx.fillStyle = o.color
            ctx.shadowColor = o.color
            ctx.shadowBlur = type === 'lanterns' ? 12 : 18
            ctx.beginPath()
            ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2)
            ctx.fill()
            ctx.restore()
          }
        }

        // 5. DISCO LIGHT BEAMS (PARTIES)
        else if (type === 'disco') {
          discoAngle += 0.008
          const cx = width / 2
          const cy = height * 0.25

          ctx.save()
          ctx.translate(cx, cy)
          ctx.rotate(discoAngle)
          const numBeams = isMobile ? 6 : 10
          for (let i = 0; i < numBeams; i++) {
            const beamAngle = (i * Math.PI * 2) / numBeams
            ctx.save()
            ctx.rotate(beamAngle)
            const grad = ctx.createLinearGradient(0, 0, 0, Math.max(width, height))
            grad.addColorStop(0, 'rgba(255, 118, 84, 0.15)')
            grad.addColorStop(1, 'transparent')
            ctx.fillStyle = grad
            ctx.beginPath()
            ctx.moveTo(0, 0)
            ctx.lineTo(-40, Math.max(width, height))
            ctx.lineTo(40, Math.max(width, height))
            ctx.closePath()
            ctx.fill()
            ctx.restore()
          }
          ctx.restore()
        }
      }

      animationFrameId = requestAnimationFrame(loop)
    }

    animationFrameId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [type, colors, paused])

  if (type === 'none') return null

  // Placed with -z-10 so it stays strictly in the background and never covers cards or text!
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none -z-10 select-none"
      style={{ opacity: 0.85 }}
    />
  )
}
