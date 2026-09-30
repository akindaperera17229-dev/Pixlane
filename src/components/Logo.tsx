'use client'

import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  className?: string
  href?: string
  priority?: boolean
  // Optional explicit size override if needed ('sm' | 'md' | 'lg' | 'xl' | 'responsive')
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'responsive'
}

export default function Logo({
  className = '',
  href = '/',
  priority = false,
  size = 'responsive',
}: LogoProps) {
  // If 'responsive' (default): 'lg' (h-10 / 40px) on mobile, 'xl' (h-14 / 56px) on desktop
  const sizeClasses = {
    responsive: 'h-10 sm:h-14',
    sm: 'h-8 sm:h-9',
    md: 'h-9 sm:h-11',
    lg: 'h-10 sm:h-12',
    xl: 'h-12 sm:h-16',
  }

  const activeHeightClass = sizeClasses[size] || sizeClasses.responsive

  const logoImage = (
    <div className={`inline-flex items-center shrink-0 ${className}`}>
      <Image
        src="/logo.png"
        alt="Pixlane - Memories in Every Angle"
        width={180}
        height={60}
        priority={priority}
        className={`${activeHeightClass} w-auto object-contain transition-transform duration-200 hover:scale-105 active:scale-95 drop-shadow-xs`}
      />
    </div>
  )

  // Every logo is clickable and navigates to the landing page by default
  return (
    <Link
      href={href || '/'}
      className="inline-flex items-center shrink-0 focus:outline-hidden group"
      title="Pixlane — Home"
    >
      {logoImage}
    </Link>
  )
}
