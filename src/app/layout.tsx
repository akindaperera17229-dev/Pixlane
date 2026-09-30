import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Pixlane — Every angle. One place.',
  description: 'Create an event. Share a link. Collect everyone\'s photos in one beautiful gallery. Built for Sri Lanka.',
  manifest: '/manifest.json',
  themeColor: '#0f766e',
  openGraph: {
    title: 'Pixlane',
    description: 'Share your event moments — no app needed.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={geist.className}>
        {children}
      </body>
    </html>
  )
}
