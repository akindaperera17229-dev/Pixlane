import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pixlane — Every angle. One place.',
  description: "Create an event. Share a link. Collect everyone's photos in one beautiful gallery. Built for Sri Lanka.",
  manifest: '/manifest.json',
  openGraph: {
    title: 'Pixlane',
    description: 'Share your event moments — no app needed.',
    type: 'website',
  },
}

// themeColor must be in viewport export, not metadata (Next.js 15+)
export const viewport: Viewport = {
  themeColor: '#0f766e',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // suppressHydrationWarning prevents false hydration errors from browser extensions
    <html lang="en" suppressHydrationWarning>
      <body className={geist.className}>
        {children}
      </body>
    </html>
  )
}
